import { promotionRepository } from "../repositories/promotionRepository.js";
import { Promotion } from "../models/Promotion.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/apiError.js";

export const promotionService = {
  // Lấy danh sách toàn bộ Flash Sale promotions đang chạy (cho trang chủ)
  getFlashSalePromotion: async () => {
    const now = new Date();
    
    // 1. Tìm tất cả các chiến dịch Flash Sale đang diễn ra (hỗ trợ nhiều chiến dịch cùng lúc)
    let activeFlashSales = await Promotion.find({
      isActive: true,
      isFlashSale: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .sort({ priority: -1, updatedAt: -1 })
      .lean();

    // Fallback: Nếu không có chiến dịch nào tick isFlashSale, lấy các khuyến mãi active thường
    if (!activeFlashSales || activeFlashSales.length === 0) {
      activeFlashSales = await Promotion.find({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      })
        .sort({ priority: -1, updatedAt: -1 })
        .lean();
    }

    if (!activeFlashSales || activeFlashSales.length === 0) {
      return null;
    }

    // Lấy chiến dịch ưu tiên cao nhất làm đại diện
    const mainPromotion = activeFlashSales[0];
    
    // Tìm thời điểm kết thúc gần nhất trong số các chiến dịch đang chạy để đếm ngược chính xác
    const nearestEndDate = activeFlashSales.reduce((min, p) => {
      const end = new Date(p.endDate);
      return end < min ? end : min;
    }, new Date(mainPromotion.endDate));

    // 2. Thu thập và hợp nhất danh sách sản phẩm từ TẤT CẢ các chiến dịch Flash Sale đang chạy
    const allProductIdsSet = new Set();
    for (const promo of activeFlashSales) {
      const ids = await promotionService._getAffectedProductIds(promo);
      ids.forEach((id) => allProductIdsSet.add(id));
    }

    // Lấy toàn bộ sản phẩm thuộc các chiến dịch Flash Sale HOẶC có gắn cờ isFlashSale
    const productQuery =
      allProductIdsSet.size > 0
        ? {
            $or: [
              { _id: { $in: Array.from(allProductIdsSet) } },
              { isFlashSale: true },
            ],
          }
        : {
            $or: [
              { isFlashSale: true },
              { discountPercent: { $gt: 0 } },
              { originalPrice: { $gt: 0 } },
            ],
          };

    let products = await Product.find(productQuery)
      .select("-description")
      .populate("category", "name slug pcPartType")
      .lean();

    // 3. SẮP XẾP: Ưu tiên giảm giá nhiều nhất lên đầu (% giảm cao nhất rồi đến số tiền giảm)
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
      promotion: {
        ...mainPromotion,
        endDate: nearestEndDate,
      },
      promotions: activeFlashSales,
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

    if (new Date(data.startDate) > new Date(data.endDate)) {
      throw new ApiError(400, "Ngày bắt đầu không được lớn hơn ngày kết thúc");
    }

    if (data.discountType === "percentage" && data.discountValue > 100) {
      throw new ApiError(400, "Mức giảm phần trăm không được vượt quá 100%");
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

    // Khôi phục giá gốc cho sản phẩm trước khi xóa
    await promotionService._removeDiscountFromProducts(promo);

    return await promotionRepository.delete(id);
  },

  togglePromotion: async (id) => {
    const promo = await promotionRepository.findById(id);
    if (!promo) {
      throw new ApiError(404, "Không tìm thấy chương trình khuyến mãi");
    }

    if (promo.isActive) {
      // Tắt → Khôi phục giá gốc
      await promotionService._removeDiscountFromProducts(promo);
    }

    promo.isActive = !promo.isActive;
    await promo.save();

    if (promo.isActive) {
      // Bật → Áp dụng giảm giá
      await promotionService._applyDiscountToProducts(promo);
    }

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
