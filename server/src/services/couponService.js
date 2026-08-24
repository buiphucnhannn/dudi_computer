import { couponRepository } from "../repositories/couponRepository.js";
import { ApiError } from "../utils/apiError.js";

export const couponService = {
  getCoupons: async (params = {}) => {
    const query = {};

    if (params.search) {
      query.$or = [
        { code: { $regex: params.search, $options: "i" } },
        { name: { $regex: params.search, $options: "i" } },
      ];
    }

    if (params.isActive !== undefined && params.isActive !== "all") {
      query.isActive = params.isActive === "true" || params.isActive === true;
    }

    if (params.status === "active") {
      query.isActive = true;
      query.endDate = { $gte: new Date() };
    } else if (params.status === "expired") {
      query.endDate = { $lt: new Date() };
    }

    return await couponRepository.find(query, params);
  },

  getCouponById: async (id) => {
    const coupon = await couponRepository.findById(id);
    if (!coupon) {
      throw new ApiError(404, "Không tìm thấy mã khuyến mãi yêu cầu");
    }
    return coupon;
  },

  createCoupon: async (data) => {
    const existing = await couponRepository.findByCode(data.code);
    if (existing) {
      throw new ApiError(400, `Mã khuyến mãi "${data.code.toUpperCase()}" đã tồn tại trên hệ thống`);
    }

    if (new Date(data.startDate) > new Date(data.endDate)) {
      throw new ApiError(400, "Ngày bắt đầu không được lớn hơn ngày hết hạn");
    }

    return await couponRepository.create({
      ...data,
      code: data.code.toUpperCase().trim(),
    });
  },

  updateCoupon: async (id, data) => {
    const coupon = await couponRepository.findById(id);
    if (!coupon) {
      throw new ApiError(404, "Không tìm thấy mã khuyến mãi cần cập nhật");
    }

    if (data.code && data.code.toUpperCase() !== coupon.code) {
      const existing = await couponRepository.findByCode(data.code);
      if (existing && existing._id.toString() !== id) {
        throw new ApiError(400, `Mã khuyến mãi "${data.code.toUpperCase()}" đã tồn tại`);
      }
      data.code = data.code.toUpperCase().trim();
    }

    return await couponRepository.update(id, data);
  },

  deleteCoupon: async (id) => {
    const coupon = await couponRepository.findById(id);
    if (!coupon) {
      throw new ApiError(404, "Không tìm thấy mã khuyến mãi cần xóa");
    }
    return await couponRepository.delete(id);
  },

  // Áp dụng và tính toán giảm giá cho đơn hàng
  validateCoupon: async (code, cartTotal = 0) => {
    if (!code) {
      throw new ApiError(400, "Vui lòng nhập mã khuyến mãi");
    }

    const coupon = await couponRepository.findByCode(code);
    if (!coupon) {
      throw new ApiError(404, "Mã khuyến mãi không tồn tại hoặc đã bị xóa");
    }

    if (!coupon.isActive) {
      throw new ApiError(400, "Mã khuyến mãi này hiện đang tạm ngưng sử dụng");
    }

    const now = new Date();
    if (coupon.startDate && now < new Date(coupon.startDate)) {
      throw new ApiError(400, "Chương trình khuyến mãi này chưa bắt đầu");
    }

    if (coupon.endDate && now > new Date(coupon.endDate)) {
      throw new ApiError(400, "Mã khuyến mãi đã hết hạn sử dụng");
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new ApiError(400, "Mã khuyến mãi đã hết lượt sử dụng");
    }

    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      throw new ApiError(
        400,
        `Mã này chỉ áp dụng cho đơn hàng từ ${coupon.minOrderValue.toLocaleString("vi-VN")}đ trở lên`
      );
    }

    // Tính toán số tiền giảm
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Không được giảm vượt quá tổng tiền đơn hàng
    if (discountAmount > cartTotal) {
      discountAmount = cartTotal;
    }

    return {
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        name: coupon.name,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discountAmount,
      finalTotal: cartTotal - discountAmount,
    };
  },
};
