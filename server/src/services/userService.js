import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { ApiError } from "../utils/apiError.js";

export const userService = {
  // Lấy danh sách tài khoản khách hàng (Chỉ lấy tài khoản khách hàng, loại trừ admin)
  getCustomers: async (params = {}) => {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 15));
    const skip = (page - 1) * limit;

    const query = {};

    if (params.role && params.role !== "all") {
      query.role = params.role;
    } else if (!params.includeAllRoles) {
      // Mặc định không hiển thị Super Admin để bảo vệ tài khoản gốc
      query.role = { $nin: ["admin", "admin_super"] };
    }

    if (params.search) {
      query.$or = [
        { name: { $regex: params.search, $options: "i" } },
        { email: { $regex: params.search, $options: "i" } },
        { phone: { $regex: params.search, $options: "i" } },
      ];
    }

    if (params.status && params.status !== "all") {
      query.status = params.status;
    }

    if (params.authType && params.authType !== "all") {
      query.authType = params.authType;
    }

    const [customers, total] = await Promise.all([
      User.find(query)
        .select("-password -refreshToken")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    return {
      items: customers || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  // Thống kê tổng quan khách hàng (Chỉ tính tài khoản khách hàng)
  getCustomerStats: async () => {
    const customerFilter = { role: { $ne: "admin" } };
    const [total, active, banned, googleCount, localCount] = await Promise.all([
      User.countDocuments(customerFilter),
      User.countDocuments({ ...customerFilter, status: "active" }),
      User.countDocuments({ ...customerFilter, status: "banned" }),
      User.countDocuments({ ...customerFilter, authType: "google" }),
      User.countDocuments({ ...customerFilter, authType: "local" }),
    ]);

    return {
      total,
      active,
      banned,
      googleCount,
      localCount,
    };
  },

  // Xem chi tiết khách hàng và lịch sử đơn hàng
  getCustomerById: async (id) => {
    const customer = await User.findOne({ _id: id, role: "user" })
      .select("-password -refreshToken")
      .lean();

    if (!customer) {
      throw new ApiError(404, "Không tìm thấy tài khoản khách hàng yêu cầu");
    }

    // Đính kèm lịch sử đơn hàng gần nhất
    const orders = await Order.find({ user: id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return {
      ...customer,
      recentOrders: orders || [],
    };
  },

  // Cập nhật trạng thái khách hàng (Khóa / Mở khóa tài khoản)
  updateCustomerStatus: async (id, status) => {
    if (!["active", "pending", "banned"].includes(status)) {
      throw new ApiError(400, "Trạng thái tài khoản không hợp lệ");
    }

    const customer = await User.findOne({ _id: id, role: "user" });
    if (!customer) {
      throw new ApiError(404, "Không tìm thấy khách hàng hoặc không có quyền thao tác");
    }

    customer.status = status;
    await customer.save();

    return {
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      role: customer.role,
      status: customer.status,
    };
  },

  // Cập nhật quyền hạn vai trò tài khoản (Chỉ dành cho Super Admin)
  updateUserRole: async (id, role) => {
    const validRoles = ["user", "admin_sales", "admin_content", "admin_customer", "admin"];
    if (!validRoles.includes(role)) {
      throw new ApiError(400, "Vai trò phân quyền không hợp lệ");
    }

    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "Không tìm thấy người dùng");
    }

    // Không cho phép thay đổi tài khoản Admin gốc
    if (user.email === "admin@zcomputer.vn" || user.email === "admin@dudi.vn") {
      throw new ApiError(403, "Không thể thay đổi quyền hạn của tài khoản Quản trị viên tối cao");
    }

    user.role = role;
    await user.save();

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  },

  // Xóa tài khoản khách hàng
  deleteCustomer: async (id) => {
    const customer = await User.findOne({ _id: id, role: { $nin: ["admin", "admin_super"] } });
    if (!customer) {
      throw new ApiError(404, "Không tìm thấy người dùng hoặc không thể xóa tài khoản Quản trị viên");
    }

    await User.findByIdAndDelete(id);
    return true;
  },
};
