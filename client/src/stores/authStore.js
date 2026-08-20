import { create } from "zustand";
import { authAPI } from "@/lib/api";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  initAuth: () => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("zcomputer_user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          set({
            user,
            isAuthenticated: true,
          });
        } catch (e) {
          console.error("Lỗi đọc thông tin người dùng", e);
        }
      }
    }
  },

  // Đăng nhập / Cập nhật người dùng (Token được lưu an toàn trong HttpOnly Cookie phía Server)
  setAuth: (user) => {
    set({ user, isAuthenticated: !!user });
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("zcomputer_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("zcomputer_user");
      }
    }
  },

  // Đăng xuất an toàn: Thu hồi HttpOnly Cookies trên server và xóa cache UI
  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.warn("Lỗi khi gọi API đăng xuất:", error);
    } finally {
      set({ user: null, isAuthenticated: false });
      if (typeof window !== "undefined") {
        localStorage.removeItem("zcomputer_user");
      }
    }
  },
}));
