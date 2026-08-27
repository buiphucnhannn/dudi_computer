import { promotionRepository } from "../repositories/promotionRepository.js";
import { Promotion } from "../models/Promotion.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/apiError.js";
import { sessionManager } from "../utils/sessionManager.js";
import { deleteCloudinaryByUrl } from "../config/cloudinary.js";

export const promotionService = {
  // Lấy chiến dịch Flash Sale duy nhất đang chạy (cho trang chủ)
  getFlashSalePromotion: async () => {
    const now = new Date();
    
    // 1. Tìm chiến dịch Flash Sale duy nhất đang diễn ra (isFlashSale: true & isActive: true)
    const activeFlashSale = await Promotion.findOne({
      isActive: true,
      isFlashSale: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .sort({ priority: -1, updatedAt: -1 })
      .lean();

    if (!activeFlashSale) {
      return null;
    }

    // 2. Lấy danh sách sản phẩm thuộc chiến dịch Flash Sale duy nhất này
    const affectedIds = await promotionService._getAffectedProductIds(activeFlashSale);
    
    const productQuery = affectedIds.length > 0
      ? {
          $or: [
            { _id: { $in: affectedIds } },
            { isFlashSale: true },
          ],
        }
      : { isFlashSale: true };

    let products = await Product.find(productQuery)
      .select("-description")
      .populate("category", "name slug pcPartType parent")
      .lean();

    // 3. Sắp xếp: Ưu tiên giảm giá nhiều nhất (% giảm cao nhất rồi đến số tiền giảm)
    products.sort((a, b) => {
      const getPercent = (p) => {
        if (p.discountPercent && Number(p.discountPercent) > 0) return Number(p.discountPercent);
        const orig = Number(p.originalPrice || 0);
        const cur = Number(p.price || 0);
        if (orig > cur && orig > 0) return Math.round(((orig - cur) / orig) * 100);
        return 0;
      };

      const getDiscountAmount = (p) => {
        const orig = Number(p.originalPrice || p.price || 0);
        const cur = Number(p.price || 0);
        return orig > cur ? orig - cur : 0;
      };

      const percentDiff = getPercent(b) - getPercent(a);
      if (percentDiff !== 0) return percentDiff;

      return getDiscountAmount(b) - getDiscountAmount(a);
    });

    return {
      promotion: activeFlashSale,
      products: products,
    };
  },

  // Lấy chiến dịch đang active (cho trang public)
  getActivePromotions: async (params = {}) => {
    const now = new Date();
    const query = {
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    };
    return await promotionRepository.find(query, params);
  },

  // Lấy tất cả chiến dịch (cho admin)
  getAdminPromotions: async (params = {}) => {
    const query = {};

    if (params.search && params.search.trim()) {
      query.$or = [
        { name: { $regex: params.search.trim(), $options: "i" } },
        { description: { $regex: params.search.trim(), $options: "i" } },
      ];
    }

    if (params.status === "active") {
      query.isActive = true;
      query.endDate = { $gte: new Date() };
    } else if (params.status === "expired") {
      query.endDate = { $lt: new Date() };
    } else if (params.status === "inactive") {
      query.isActive = false;
    }

    return await promotionRepository.find(query, params);
  },

  getPromotionById: async (id) => {
    const promo = await promotionRepository.findById(id);
    if (!promo) {
      throw new ApiError(404, "Không tìm thấy chương trình khuyến mãi");
    }
    return promo;
  },

  createPromotion: async (data) => {
    // Auto-generate slug
    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    if (!data.startDate || !data.endDate) {
      throw new ApiError(400, "Vui lòng nhập đầy đủ ngày bắt đầu và ngày kết thúc khuyến mãi");
    }

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new ApiError(400, "Định dạng ngày bắt đầu hoặc ngày kết thúc không hợp lệ");
    }

    if (start > end) {
      throw new ApiError(400, "Ngày kết thúc phải diễn ra sau hoặc cùng ngày với ngày bắt đầu");
    }

    // Nếu kích hoạt chương trình: ngày kết thúc không được ở trong quá khứ
    if (data.isActive !== false) {
      const endOfDay = new Date(end);
      endOfDay.setHours(23, 59, 59, 999);
      if (endOfDay < new Date()) {
        throw new ApiError(
          400,
          "Không thể kích hoạt chương trình có ngày kết thúc trong quá khứ! Vui lòng chọn ngày kết thúc từ hôm nay trở đi."
        );
      }
    }

    if (data.discountType === "percentage" && data.discountValue > 100) {
      throw new ApiError(400, "Mức giảm phần trăm không được vượt quá 100%");
    }

    // RÀNG BUỘC: Duy nhất 1 chiến dịch Flash Sale được hoạt động tại một thời điểm
    if (data.isFlashSale && data.isActive !== false) {
      const now = new Date();
      const existingFlashSale = await Promotion.findOne({
        isFlashSale: true,
        isActive: true,
        endDate: { $gte: now },
      });
      if (existingFlashSale) {
        throw new ApiError(
          400,
          `Hiện tại đang có chiến dịch Flash Sale "${existingFlashSale.name}" đang hoạt động. Hệ thống chỉ cho phép duy nhất một chiến dịch Flash Sale chạy tại một thời điểm. Vui lòng tắt chiến dịch hiện tại trước khi kích hoạt chiến dịch mới.`
        );
      }
    }

    const promo = await promotionRepository.create(data);

    // Tự động áp dụng giảm giá lên sản phẩm nếu chiến dịch đang active
    if (promo.isActive) {
      await promotionService._applyDiscountToProducts(promo);
    }

    return await promotionRepository.findById(promo._id);
  },

  updatePromotion: async (id, data) => {
    const promo = await promotionRepository.findById(id);
    if (!promo) {
      throw new ApiError(404, "Không tìm thấy chương trình khuyến mãi cần cập nhật");
    }

    const startDateStr = data.startDate || promo.startDate;
    const endDateStr = data.endDate || promo.endDate;

    if (startDateStr && endDateStr) {
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new ApiError(400, "Định dạng ngày bắt đầu hoặc ngày kết thúc không hợp lệ");
      }

      if (start > end) {
        throw new ApiError(400, "Ngày kết thúc phải diễn ra sau hoặc cùng ngày với ngày bắt đầu");
      }

      const willBeActive = data.isActive !== undefined ? data.isActive : promo.isActive;
      if (willBeActive) {
        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);
        if (endOfDay < new Date()) {
          throw new ApiError(
            400,
            "Không thể kích hoạt chương trình khuyến mãi đã hết hạn trong quá khứ! Vui lòng gia hạn ngày kết thúc."
          );
        }
      }
    }

    if (data.discountType === "percentage" && data.discountValue > 100) {
      throw new ApiError(400, "Mức giảm phần trăm không được vượt quá 100%");
    }

    // RÀNG BUỘC: Duy nhất 1 chiến dịch Flash Sale được hoạt động tại một thời điểm
    const willBeFlashSale = data.isFlashSale !== undefined ? data.isFlashSale : promo.isFlashSale;
    const willBeActive = data.isActive !== undefined ? data.isActive : promo.isActive;
    if (willBeFlashSale && willBeActive) {
      const now = new Date();
      const existingFlashSale = await Promotion.findOne({
        _id: { $ne: id },
        isFlashSale: true,
        isActive: true,
        endDate: { $gte: now },
      });
      if (existingFlashSale) {
        throw new ApiError(
          400,
          `Hiện tại đang có chiến dịch Flash Sale "${existingFlashSale.name}" đang hoạt động. Hệ thống chỉ cho phép duy nhất một chiến dịch Flash Sale chạy tại một thời điểm. Vui lòng tắt chiến dịch hiện tại trước khi kích hoạt chiến dịch này.`
        );
      }
    }

    // Khôi phục giá gốc cho sản phẩm cũ trước khi cập nhật
    await promotionService._removeDiscountFromProducts(promo);

    const updated = await promotionRepository.update(id, data);

    // Áp dụng lại giảm giá mới
    if (updated.isActive) {
      await promotionService._applyDiscountToProducts(updated);
    }

    return updated;
  },

  deletePromotion: async (id) => {
    const promo = await promotionRepository.findById(id);
    if (!promo) {
      throw new ApiError(404, "Không tìm thấy chương trình khuyến mãi cần xóa");
    }

    // 1. Dọn dẹp ảnh banner trên Cloudinary nếu có
    if (promo.bannerUrl) {
      await deleteCloudinaryByUrl(promo.bannerUrl);
    }
    if (promo.imageUrl && promo.imageUrl !== promo.bannerUrl) {
      await deleteCloudinaryByUrl(promo.imageUrl);
    }

    // 2. Khôi phục giá gốc cho sản phẩm trước khi xóa
    await promotionService._removeDiscountFromProducts(promo);

    const deleted = await promotionRepository.delete(id);

    sessionManager.broadcastResourceUpdate({
      action: "delete",
      resourceType: "promotion",
      id: promo._id,
      name: promo.name,
      message: `Chương trình khuyến mãi "${promo.name}" đã kết thúc và được xóa khỏi hệ thống.`,
    });

    return deleted;
  },

  togglePromotion: async (id) => {
    const promo = await promotionRepository.findById(id);
    if (!promo) {
      throw new ApiError(404, "Không tìm thấy chương trình khuyến mãi");
    }

    if (promo.isActive) {
      // Tắt → Khôi phục giá gốc
      await promotionService._removeDiscountFromProducts(promo);
    } else {
      // Bật lại: kiểm tra xem ngày kết thúc có trong quá khứ không
      const endOfDay = new Date(promo.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (endOfDay < new Date()) {
        throw new ApiError(
          400,
          "Chương trình khuyến mãi này đã hết hạn. Vui lòng chỉnh sửa gia hạn ngày kết thúc trước khi kích hoạt lại!"
        );
      }

      // RÀNG BUỘC: Nếu bật lại chiến dịch đang là Flash Sale, kiểm tra xem đã có Flash Sale khác đang chạy chưa
      if (promo.isFlashSale) {
        const now = new Date();
        const existingFlashSale = await Promotion.findOne({
          _id: { $ne: id },
          isFlashSale: true,
          isActive: true,
          endDate: { $gte: now },
        });
        if (existingFlashSale) {
          throw new ApiError(
            400,
            `Hiện tại đang có chiến dịch Flash Sale "${existingFlashSale.name}" đang hoạt động. Hệ thống chỉ cho phép duy nhất một chiến dịch Flash Sale chạy tại một thời điểm. Vui lòng tắt chiến dịch hiện tại trước khi bật chiến dịch này.`
          );
        }
      }
    }

    promo.isActive = !promo.isActive;
    await promo.save();

    if (promo.isActive) {
      // Bật → Áp dụng giảm giá
      await promotionService._applyDiscountToProducts(promo);
    }

    sessionManager.broadcastResourceUpdate({
      action: promo.isActive ? "publish" : "hide",
      resourceType: "promotion",
      id: promo._id,
      name: promo.name,
      message: promo.isActive
        ? `Chương trình khuyến mãi "${promo.name}" đã được kích hoạt áp dụng.`
        : `Chương trình khuyến mãi "${promo.name}" đã tạm ngưng.`,
    });

    return await promotionRepository.findById(promo._id);
  },

  // --- INTERNAL: Áp dụng giảm giá lên sản phẩm ---
  _applyDiscountToProducts: async (promo) => {
    const productIds = await promotionService._getAffectedProductIds(promo);
    if (productIds.length === 0) return;

    const products = await Product.find({ _id: { $in: productIds } });

    for (const product of products) {
      const basePrice = product.originalPrice > 0 ? product.originalPrice : product.price;

      let discountAmount = 0;
      if (promo.discountType === "percentage") {
        discountAmount = Math.round((basePrice * promo.discountValue) / 100);
      } else {
        discountAmount = promo.discountValue;
      }

      // Đảm bảo không giảm quá giá gốc
      if (discountAmount > basePrice) discountAmount = basePrice;

      product.originalPrice = basePrice;
      product.price = basePrice - discountAmount;
      product.discountPrice = basePrice - discountAmount;
      product.discountPercent =
        promo.discountType === "percentage"
          ? promo.discountValue
          : Math.round((discountAmount / basePrice) * 100);
      
      // Chỉ gắn cờ isFlashSale nếu chiến dịch này là Flash Sale
      if (promo.isFlashSale) {
        product.isFlashSale = true;
      }
      await product.save();
    }
  },

  // --- INTERNAL: Khôi phục giá gốc sản phẩm ---
  _removeDiscountFromProducts: async (promo) => {
    const productIds = await promotionService._getAffectedProductIds(promo);
    if (productIds.length === 0) return;

    const now = new Date();
    // Kiểm tra xem sản phẩm có còn thuộc bất kỳ chiến dịch Flash Sale nào khác đang active không
    const otherFlashSales = await Promotion.find({
      _id: { $ne: promo._id },
      isActive: true,
      isFlashSale: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    const otherFlashSaleIds = new Set();
    for (const otherPromo of otherFlashSales) {
      const ids = await promotionService._getAffectedProductIds(otherPromo);
      ids.forEach((id) => otherFlashSaleIds.add(id));
    }

    const products = await Product.find({ _id: { $in: productIds } });
    for (const product of products) {
      if (product.originalPrice > 0) {
        product.price = product.originalPrice;
      }
      product.discountPrice = 0;
      product.discountPercent = 0;
      product.isFlashSale = otherFlashSaleIds.has(product._id.toString());
      await product.save();
    }
  },

  // --- INTERNAL: Lấy danh sách Product IDs bị ảnh hưởng ---
  _getAffectedProductIds: async (promo) => {
    if (promo.applyScope === "products") {
      return promo.appliedProducts.map((p) => (p._id || p).toString());
    } else if (promo.applyScope === "category") {
      const categoryIds = promo.appliedCategories.map((c) => (c._id || c).toString());
      const products = await Product.find({ category: { $in: categoryIds } }).select("_id");
      return products.map((p) => p._id.toString());
    } else if (promo.applyScope === "all") {
      const products = await Product.find({}).select("_id");
      return products.map((p) => p._id.toString());
    }
    return [];
  },
};
