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

    const secret = process.env.JWT_SECRET;
    const decodedToken = jwt.verify(token, secret);
    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
      throw new ApiError(401, "Phiên đăng nhập đã hết hạn hoặc người dùng không tồn tại");
    }

    // Kiểm tra trạng thái tài khoản
    if (user.status === "banned") {
      throw new ApiError(403, "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ ban quản trị.");
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, error?.message || "Xác thực token thất bại"));
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    // Security Audit Log: Ghi nhận cảnh báo khi có ai cố tình truy cập API quản trị trái phép
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;
    console.warn(
      `🚨 [SECURITY AUDIT] Truy cập API Admin bị từ chối: User=${req.user?.email || "Anonymous"}, Role=${req.user?.role || "none"}, IP=${clientIp}, Endpoint=${req.method} ${req.originalUrl}`
    );

    next(
      new ApiError(
        403,
        "Quyền truy cập bị từ chối: Bạn không có quyền Quản trị viên (Admin) để thực hiện thao tác này"
      )
    );
  }
};

