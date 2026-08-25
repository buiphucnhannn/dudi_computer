import { promotionService } from "../services/promotionService.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getFlashSalePromotion = async (req, res, next) => {
  try {
    const data = await promotionService.getFlashSalePromotion();
    if (!data) {
      return res
        .status(200)
        .json(new ApiResponse(200, { promotion: null, products: [] }, "Không có Flash Sale đang chạy"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Lấy Flash Sale thành công"));
  } catch (error) {
    next(error);
  }
};

export const getActivePromotions = async (req, res, next) => {
  try {
    const data = await promotionService.getActivePromotions(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Lấy danh sách khuyến mãi đang chạy thành công"));
  } catch (error) {
    next(error);
  }
};

export const getAdminPromotions = async (req, res, next) => {
  try {
    const data = await promotionService.getAdminPromotions(req.query);
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Lấy danh sách khuyến mãi quản trị thành công"));
  } catch (error) {
    next(error);
  }
};

export const getPromotionById = async (req, res, next) => {
  try {
    const promo = await promotionService.getPromotionById(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, promo, "Lấy chi tiết chương trình khuyến mãi thành công"));
  } catch (error) {
    next(error);
  }
};

export const createPromotion = async (req, res, next) => {
  try {
    const promo = await promotionService.createPromotion(req.body);
    return res
      .status(201)
      .json(new ApiResponse(201, promo, "Tạo chương trình khuyến mãi thành công"));
  } catch (error) {
    next(error);
  }
};

export const updatePromotion = async (req, res, next) => {
  try {
    const promo = await promotionService.updatePromotion(req.params.id, req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, promo, "Cập nhật chương trình khuyến mãi thành công"));
  } catch (error) {
    next(error);
  }
};

export const togglePromotion = async (req, res, next) => {
  try {
    const promo = await promotionService.togglePromotion(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, promo, "Đã thay đổi trạng thái chương trình khuyến mãi"));
  } catch (error) {
    next(error);
  }
};

export const deletePromotion = async (req, res, next) => {
  try {
    await promotionService.deletePromotion(req.params.id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Đã xóa chương trình khuyến mãi thành công"));
  } catch (error) {
    next(error);
  }
};
