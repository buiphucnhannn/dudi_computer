import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Tải thông tin người dùng từ localStorage khi khởi động
    initAuthFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("dudi_user") || localStorage.getItem("zcomputer_user");
        if (userStr) {
          try {
            state.user = JSON.parse(userStr);
            state.isAuthenticated = true;
          } catch (e) {
            console.error("Lỗi đọc thông tin đăng nhập", e);
          }
        }
      }
    },

    // Đăng nhập thành công (Token được quản lý trong HttpOnly Cookie)
    setCredentials: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = !!user;

      if (typeof window !== "undefined") {
        if (user) {
          localStorage.setItem("dudi_user", JSON.stringify(user));
        } else {
          localStorage.removeItem("dudi_user");
          localStorage.removeItem("zcomputer_user");
        }
      }
    },

    // Đăng xuất
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("dudi_user");
        localStorage.removeItem("zcomputer_user");
      }
    },
  },
});

export const { initAuthFromStorage, setCredentials, logoutUser } =
  authSlice.actions;

// Role-Based Access Control (RBAC) Constants & Helpers
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

export const getAdminRoleInfo = (role) => {
  switch (role) {
    case "admin":
    case "admin_super":
      return {
        key: "super",
        role: "admin",
        label: "Admin Toàn Quyền",
        shortLabel: "Super Admin",
        badgeBg: "bg-red-100 text-[#eb1c24] border-red-200",
        description: "Toàn quyền quản trị tất cả module và thiết lập hệ thống",
        allowedModuleKeys: ["overview", "commerce", "content", "customers", "settings"],
      };
    case "admin_sales":
      return {
        key: "sales",
        role: "admin_sales",
        label: "Admin Thương Mại & Bán Hàng",
        shortLabel: "Admin Bán Hàng",
        badgeBg: "bg-blue-100 text-blue-700 border-blue-200",
        description: "Quản lý sản phẩm, danh mục, đơn hàng, khuyến mãi và báo cáo doanh thu",
        allowedModuleKeys: ["overview", "commerce"],
      };
    case "admin_content":
      return {
        key: "content",
        role: "admin_content",
        label: "Admin Nội Dung & Tuyển Dụng",
        shortLabel: "Admin Nội Dung",
        badgeBg: "bg-purple-100 text-purple-700 border-purple-200",
        description: "Quản lý tin tức, bài viết và tin tuyển dụng việc làm",
        allowedModuleKeys: ["overview", "content"],
      };
    case "admin_customer":
      return {
        key: "customer",
        role: "admin_customer",
        label: "Admin Quản Lý Khách Hàng",
        shortLabel: "Admin Khách Hàng",
        badgeBg: "bg-emerald-100 text-emerald-700 border-emerald-200",
        description: "Quản lý thông tin và trạng thái tài khoản khách hàng",
        allowedModuleKeys: ["overview", "customers"],
      };
    default:
      return {
        key: "user",
        role: "user",
        label: "Khách hàng",
        shortLabel: "Khách hàng",
        badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
        description: "Tài khoản người dùng thông thường",
        allowedModuleKeys: [],
      };
  }
};

export const hasAdminModulePermission = (userRole, moduleKey) => {
  if (!userRole) return false;
  if (userRole === "admin" || userRole === "admin_super") return true;
  const info = getAdminRoleInfo(userRole);
  return info.allowedModuleKeys.includes(moduleKey);
};

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => isAdminRole(state.auth.user?.role);
export const selectUserRole = (state) => state.auth.user?.role || "user";
export const selectRoleInfo = (state) => getAdminRoleInfo(state.auth.user?.role);

export default authSlice.reducer;
