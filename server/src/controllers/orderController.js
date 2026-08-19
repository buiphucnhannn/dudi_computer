import { orderService } from "../services/index.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user?._id, req.body);
    return res
      .status(201)
      .json(new ApiResponse(201, order, "Đặt hàng thành công!"));
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getUserOrders(req.user._id);
    return res
      .status(200)
      .json(new ApiResponse(200, orders, "Lấy danh sách đơn hàng thành công"));
  } catch (error) {
    next(error);
  }
};

export const getOrderDetail = async (req, res, next) => {
  try {
    const order = await orderService.getOrderDetail(req.params.id, req.user?._id);
    return res
      .status(200)
      .json(new ApiResponse(200, order, "Lấy chi tiết đơn hàng thành công"));
  } catch (error) {
    next(error);
  }
};
