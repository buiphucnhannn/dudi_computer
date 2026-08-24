import { couponService } from "../services/couponService.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const couponController = {
  getCoupons: async (req, res, next) => {
    try {
      const result = await couponService.getCoupons(req.query);
      return res
        .status(200)
        .json(new ApiResponse(200, result, "Lấy danh sách mã khuyến mãi thành công"));
    } catch (error) {
      next(error);
    }
  },

  getCouponById: async (req, res, next) => {
    try {
      const coupon = await couponService.getCouponById(req.params.id);
      return res
        .status(200)
        .json(new ApiResponse(200, coupon, "Lấy chi tiết mã khuyến mãi thành công"));
    } catch (error) {
      next(error);
    }
  },

  createCoupon: async (req, res, next) => {
    try {
      const coupon = await couponService.createCoupon(req.body);
      return res
        .status(201)
        .json(new ApiResponse(201, coupon, "Tạo mã khuyến mãi mới thành công"));
    } catch (error) {
      next(error);
    }
  },

  updateCoupon: async (req, res, next) => {
    try {
      const coupon = await couponService.updateCoupon(req.params.id, req.body);
      return res
        .status(200)
        .json(new ApiResponse(200, coupon, "Cập nhật mã khuyến mãi thành công"));
    } catch (error) {
      next(error);
    }
  },

  deleteCoupon: async (req, res, next) => {
    try {
      await couponService.deleteCoupon(req.params.id);
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Xóa mã khuyến mãi thành công"));
    } catch (error) {
      next(error);
    }
  },

  validateCoupon: async (req, res, next) => {
    try {
      const { code, cartTotal } = req.body;
      const result = await couponService.validateCoupon(code, Number(cartTotal) || 0);
      return res
        .status(200)
        .json(new ApiResponse(200, result, "Áp dụng mã khuyến mãi thành công!"));
    } catch (error) {
      next(error);
    }
  },
};
