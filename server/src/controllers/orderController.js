import { orderService } from "../services/index.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getAllOrders = async (req, res, next) => {
  try {
    const { orders, pagination } = await orderService.getOrders(req.query);
    return res.status(200).json(
      new ApiResponse(
        200,
        { orders, pagination },
        "Lấy danh sách đơn hàng thành công"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    return res.status(200).json(
      new ApiResponse(200, order, "Lấy thông tin đơn hàng thành công")
    );
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);
    return res.status(201).json(
      new ApiResponse(201, order, "Tạo đơn hàng mới thành công")
    );
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const order = await orderService.updateOrderStatus(id, status, note);
    return res.status(200).json(
      new ApiResponse(200, order, "Cập nhật trạng thái đơn hàng thành công")
    );
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    await orderService.deleteOrder(id);
    return res.status(200).json(
      new ApiResponse(200, { id }, "Xóa đơn hàng thành công")
    );
  } catch (error) {
    next(error);
  }
};
