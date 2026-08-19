import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Tải thông tin auth từ localStorage
    initAuthFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("zcomputer_token");
        const userStr = localStorage.getItem("zcomputer_user");
        if (token && userStr) {
          try {
            state.token = token;
            state.user = JSON.parse(userStr);
            state.isAuthenticated = true;
          } catch (e) {
            console.error("Lỗi đọc thông tin đăng nhập", e);
          }
        }
      }
    },

    // Đăng nhập thành công
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        localStorage.setItem("zcomputer_token", token);
        localStorage.setItem("zcomputer_user", JSON.stringify(user));
      }
    },

    // Đăng xuất
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("zcomputer_token");
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
