import { userService } from "../services/userService.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const userController = {
  getCustomers: async (req, res, next) => {
    try {
      const result = await userService.getCustomers(req.query);
      return res
        .status(200)
        .json(new ApiResponse(200, result, "Lấy danh sách khách hàng thành công"));
    } catch (error) {
      next(error);
    }
  },

  getCustomerStats: async (req, res, next) => {
    try {
      const stats = await userService.getCustomerStats();
      return res
        .status(200)
        .json(new ApiResponse(200, stats, "Lấy thống kê khách hàng thành công"));
    } catch (error) {
      next(error);
    }
  },

  getCustomerById: async (req, res, next) => {
    try {
      const customer = await userService.getCustomerById(req.params.id);
      return res
        .status(200)
        .json(new ApiResponse(200, customer, "Lấy thông tin khách hàng thành công"));
    } catch (error) {
      next(error);
    }
  },

  updateCustomerStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      const updated = await userService.updateCustomerStatus(req.params.id, status);
      return res
        .status(200)
        .json(new ApiResponse(200, updated, `Cập nhật trạng thái khách hàng sang "${status}" thành công`));
    } catch (error) {
      next(error);
    }
  },

  deleteCustomer: async (req, res, next) => {
    try {
      await userService.deleteCustomer(req.params.id);
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Xóa tài khoản khách hàng thành công"));
    } catch (error) {
      next(error);
    }
  },
};
