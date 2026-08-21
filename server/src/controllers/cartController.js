import { cartService } from "../services/index.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "Yêu cầu đăng nhập");
    }

    const items = await cartService.getCart(userId);
    return res
      .status(200)
      .json(new ApiResponse(200, items, "Lấy giỏ hàng thành công"));
  } catch (error) {
    next(error);
  }
};

export const syncCart = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "Yêu cầu đăng nhập");
    }

    const { items } = req.body;
    const syncedItems = await cartService.syncCart(userId, items || []);
    return res
      .status(200)
      .json(new ApiResponse(200, syncedItems, "Đồng bộ giỏ hàng thành công"));
  } catch (error) {
    next(error);
  }
};

export const addItemToCart = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "Yêu cầu đăng nhập");
    }

    const { productId, quantity } = req.body;
    if (!productId) {
      throw new ApiError(400, "Vui lòng cung cấp productId");
    }

    const items = await cartService.addItem(userId, productId, quantity);
    return res
      .status(200)
      .json(new ApiResponse(200, items, "Thêm sản phẩm vào giỏ hàng thành công"));
  } catch (error) {
    next(error);
  }
};

export const updateCartItemQuantity = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "Yêu cầu đăng nhập");
    }

    const { id } = req.params;
    const { quantity } = req.body;
    if (quantity === undefined) {
      throw new ApiError(400, "Vui lòng cung cấp quantity");
    }

    const items = await cartService.updateQuantity(userId, id, quantity);
    return res
      .status(200)
      .json(new ApiResponse(200, items, "Cập nhật số lượng giỏ hàng thành công"));
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "Yêu cầu đăng nhập");
    }

    const { id } = req.params;
    const items = await cartService.removeItem(userId, id);
    return res
      .status(200)
      .json(new ApiResponse(200, items, "Xóa sản phẩm khỏi giỏ hàng thành công"));
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "Yêu cầu đăng nhập");
    }

    const items = await cartService.clearCart(userId);
    return res
      .status(200)
      .json(new ApiResponse(200, items, "Xóa toàn bộ giỏ hàng thành công"));
  } catch (error) {
    next(error);
  }
};
