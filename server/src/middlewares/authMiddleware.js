import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/User.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Yêu cầu đăng nhập để truy cập tài nguyên này");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
      throw new ApiError(401, "Token không hợp lệ hoặc người dùng không tồn tại");
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, error?.message || "Token không hợp lệ"));
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    next(new ApiError(403, "Bạn không có quyền quản trị viên (Admin) để thực hiện thao tác này"));
  }
};
