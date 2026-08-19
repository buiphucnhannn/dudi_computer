import { createSlice } from "@reduxjs/toolkit";

// Helper lưu vào localStorage
const saveCartToStorage = (items) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("zcomputer_cart", JSON.stringify(items));
  }
};

const initialState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Tải dữ liệu giỏ hàng từ localStorage khi app load
    loadCartFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("zcomputer_cart");
        if (saved) {
          try {
            state.items = JSON.parse(saved);
          } catch (e) {
            console.error("Lỗi đọc giỏ hàng", e);
          }
        }
      }
    },

    // Thêm sản phẩm vào giỏ
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex((i) => i._id === product._id);

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({
          _id: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          originalPrice: product.originalPrice,
          thumbnail: product.thumbnail || product.images?.[0] || "",
          quantity,
        });
      }

      saveCartToStorage(state.items);
    },

    // Cập nhật số lượng
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item._id !== productId);
      } else {
        const item = state.items.find((item) => item._id === productId);
        if (item) {
          item.quantity = quantity;
        }
      }
      saveCartToStorage(state.items);
    },

    // Xóa 1 sản phẩm
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item._id !== productId);
      saveCartToStorage(state.items);
    },

    // Xóa trắng giỏ hàng
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },
  },
});

export const {
  loadCartFromStorage,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectTotalItems = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectTotalPrice = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;
