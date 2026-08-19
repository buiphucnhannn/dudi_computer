import { authService } from "../services/index.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const registerUser = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return res
      .status(201)
      .json(new ApiResponse(201, result, "Đăng ký tài khoản thành công"));
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return res
      .status(200)
      .json(new ApiResponse(200, result, "Đăng nhập thành công"));
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Lấy thông tin người dùng thành công"));
  } catch (error) {
    next(error);
  }
};
