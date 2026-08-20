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
        const userStr = localStorage.getItem("zcomputer_user");
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
          localStorage.setItem("zcomputer_user", JSON.stringify(user));
        } else {
          localStorage.removeItem("zcomputer_user");
        }
      }
    },

    // Đăng xuất
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("zcomputer_user");
      }
    },
  },
});

export const { initAuthFromStorage, setCredentials, logoutUser } =
  authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
