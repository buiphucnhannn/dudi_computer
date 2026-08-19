import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  initAuth: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("zcomputer_token");
      const userStr = localStorage.getItem("zcomputer_user");
      if (token && userStr) {
        try {
          set({
            token,
            user: JSON.parse(userStr),
            isAuthenticated: true,
          });
        } catch (e) {
          console.error("Lỗi parse user", e);
        }
      }
    }
  },

  setAuth: (user, token) => {
    set({ user, token, isAuthenticated: true });
    if (typeof window !== "undefined") {
      localStorage.setItem("zcomputer_token", token);
      localStorage.setItem("zcomputer_user", JSON.stringify(user));
    }
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
    if (typeof window !== "undefined") {
      localStorage.removeItem("zcomputer_token");
      localStorage.removeItem("zcomputer_user");
    }
  },
}));
