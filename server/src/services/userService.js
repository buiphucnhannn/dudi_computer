import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { ApiError } from "../utils/apiError.js";

export const userService = {
  // Lấy danh sách tài khoản khách hàng (Chỉ lấy role: "user")
  getCustomers: async (params = {}) => {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 15));
    const skip = (page - 1) * limit;

    // BẮT BUỘC CHỈ QUẢN LÝ TÀI KHOẢN KHÁCH HÀNG (role: "user")
    const query = { role: "user" };

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

  // Thống kê tổng quan khách hàng
  getCustomerStats: async () => {
    const [total, active, banned, googleCount, localCount] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "user", status: "active" }),
      User.countDocuments({ role: "user", status: "banned" }),
      User.countDocuments({ role: "user", authType: "google" }),
      User.countDocuments({ role: "user", authType: "local" }),
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
      status: customer.status,
    };
  },

  // Xóa tài khoản khách hàng
  deleteCustomer: async (id) => {
    const customer = await User.findOne({ _id: id, role: "user" });
    if (!customer) {
      throw new ApiError(404, "Không tìm thấy khách hàng cần xóa");
    }

    await User.findByIdAndDelete(id);
    return true;
  },
};
