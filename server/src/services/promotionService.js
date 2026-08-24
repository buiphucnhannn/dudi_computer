import { promotionRepository } from "../repositories/promotionRepository.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/apiError.js";

export const promotionService = {
  // Lấy Flash Sale promotion đang chạy (cho trang chủ)
  getFlashSalePromotion: async () => {
    const now = new Date();
    let flashSale = await promotionRepository.findOne(
      {
        isActive: true,
        isFlashSale: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      },
      { sort: { priority: -1, updatedAt: -1 } }
    );

    if (!flashSale) {
      flashSale = await promotionRepository.findOne(
        {
          isActive: true,
          startDate: { $lte: now },
          endDate: { $gte: now },
        },
        { sort: { priority: -1, updatedAt: -1 } }
      );
    }

    if (!flashSale) {
      return null;
    }

    // Lấy danh sách sản phẩm áp dụng Flash Sale
    const productIds = await promotionService._getAffectedProductIds(flashSale);
    const products = await Product.find({ _id: { $in: productIds } })
      .select("-description")
      .limit(20)
      .lean();

    return {
      promotion: flashSale,
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
      product.isFlashSale = true;
      await product.save();
    }
  },

  // --- INTERNAL: Khôi phục giá gốc sản phẩm ---
  _removeDiscountFromProducts: async (promo) => {
    const productIds = await promotionService._getAffectedProductIds(promo);
    if (productIds.length === 0) return;

    const products = await Product.find({ _id: { $in: productIds } });
    for (const product of products) {
      if (product.originalPrice > 0) {
        product.price = product.originalPrice;
      }
      product.discountPrice = 0;
      product.discountPercent = 0;
      product.isFlashSale = false;
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
