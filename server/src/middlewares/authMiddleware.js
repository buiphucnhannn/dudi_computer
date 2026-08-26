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
    next(new ApiError(error?.statusCode || 401, error?.message || "Xác thực token thất bại"));
  }
};

export const ADMIN_ROLES = [
  "admin",
  "admin_super",
  "admin_sales",
  "admin_content",
  "admin_customer",
];

export const isAdminRole = (role) => {
  if (!role) return false;
  return ADMIN_ROLES.includes(role);
};

export const requireAdmin = (req, res, next) => {
  if (req.user && isAdminRole(req.user.role)) {
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

export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Yêu cầu đăng nhập"));
    }

    // Admin toàn quyền luôn có quyền truy cập tất cả
    if (req.user.role === "admin" || req.user.role === "admin_super") {
      return next();
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;
    console.warn(
      `🚨 [SECURITY AUDIT] Truy cập chức năng bị từ chối: User=${req.user?.email || "Anonymous"}, Role=${req.user?.role || "none"}, AllowedRoles=[${allowedRoles.join(",")}], IP=${clientIp}, Endpoint=${req.method} ${req.originalUrl}`
    );

    return next(
      new ApiError(
        403,
        "Quyền truy cập bị từ chối: Tài khoản của bạn không được phân quyền thực hiện chức năng này"
      )
    );
  };
};

// Admin Thương Mại & Bán Hàng (Sản phẩm, Danh mục, Đơn hàng, Khuyến mãi, Thống kê)
export const requireSalesAdmin = requireRole(["admin_sales"]);

// Admin Nội Dung & Tuyển Dụng (Tin tức, Bài viết, Tuyển dụng việc làm)
export const requireContentAdmin = requireRole(["admin_content"]);

// Admin Quản Lý Khách Hàng (Xem & quản lý khách hàng)
export const requireCustomerAdmin = requireRole(["admin_customer"]);

// Admin Toàn Quyền (Chỉ dành cho Super Admin: Cài đặt hệ thống, Phân quyền)
export const requireSuperAdmin = requireRole([]);

export const verifyOptionalJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const secret = process.env.JWT_SECRET;
      const decodedToken = jwt.verify(token, secret);
      const user = await User.findById(decodedToken?._id).select("-password");
      if (user && user.status !== "banned") {
        req.user = user;
      }
    }
  } catch (error) {
    // Bỏ qua lỗi nếu không có token hoặc token hết hạn trong chế độ optional
  }
  next();
};

export const preventAdminShopping = (req, res, next) => {
  if (req.user && isAdminRole(req.user.role)) {
    return next(
      new ApiError(
        403,
        "Tài khoản Quản trị viên (Admin) không được phép thực hiện chức năng mua hàng / đặt hàng"
      )
    );
  }
  next();
};
