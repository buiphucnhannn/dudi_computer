import { wishlistService } from "../services/index.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getWishlist = async (req, res, next) => {
  try {
    const items = await wishlistService.getWishlist(req.user._id);
    return res
      .status(200)
      .json(new ApiResponse(200, items, "Lấy danh sách yêu thích thành công"));
  } catch (error) {
    next(error);
  }
};

export const syncWishlist = async (req, res, next) => {
  try {
    const items = await wishlistService.syncWishlist(
      req.user._id,
      req.body?.items || []
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, items, "Đồng bộ danh sách yêu thích thành công")
      );
  } catch (error) {
    next(error);
  }
};

export const addItem = async (req, res, next) => {
  try {
    const items = await wishlistService.addItem(req.user._id, req.body);
    return res
      .status(200)
      .json(
        new ApiResponse(200, items, "Đã thêm vào danh sách yêu thích")
      );
  } catch (error) {
    next(error);
  }
};

export const updateQuantity = async (req, res, next) => {
  try {
    const items = await wishlistService.updateQuantity(req.user._id, {
      productId: req.params.productId,
      quantity: req.body.quantity,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, items, "Cập nhật số lượng thành công")
      );
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const items = await wishlistService.removeItem(
      req.user._id,
      req.params.productId
    );
    return res
      .status(200)
      .json(
        new ApiResponse(200, items, "Đã xóa khỏi danh sách yêu thích")
      );
  } catch (error) {
    next(error);
  }
};

export const clearWishlist = async (req, res, next) => {
  try {
    const items = await wishlistService.clearWishlist(req.user._id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, items, "Đã xóa toàn bộ danh sách yêu thích")
      );
  } catch (error) {
    next(error);
  }
};
