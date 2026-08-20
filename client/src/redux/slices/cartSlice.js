import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistAPI } from "@/lib/api";

// Helper lưu vào localStorage
const saveCartToStorage = (items) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("zcomputer_cart", JSON.stringify(items));
  }
};

// Helper đọc từ localStorage
const getLocalCart = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("zcomputer_cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Lỗi đọc giỏ hàng", e);
      }
    }
  }
  return [];
};

// Async Thunk: Đồng bộ giỏ hàng / danh sách yêu thích khi Đăng nhập (Auto-Merge)
export const syncWishlistWithCloud = createAsyncThunk(
  "cart/syncWishlistWithCloud",
  async (_, { getState, rejectWithValue }) => {
    try {
      const localItems = getState().cart.items || getLocalCart();
      const res = await wishlistAPI.sync(localItems);
      return res.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lỗi đồng bộ Wishlist");
    }
  }
);

// Async Thunk: Tải Wishlist từ Cloud khi vào app nếu đã đăng nhập
export const fetchCloudWishlist = createAsyncThunk(
  "cart/fetchCloudWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const res = await wishlistAPI.get();
      return res.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lỗi tải Wishlist");
    }
  }
);

// Async Thunk: Thêm sản phẩm (Optimistic Update + Cloud Sync)
export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ product, quantity = 1 }, { getState, dispatch }) => {
    // 1. Cập nhật state cục bộ ngay lập tức (0ms delay)
    dispatch(addToCart({ product, quantity }));

    // 2. Nếu đã đăng nhập, gửi API lưu vào MongoDB
    const isAuthenticated = getState().auth?.isAuthenticated;
    if (isAuthenticated && product?._id) {
      try {
        await wishlistAPI.addItem(product._id, quantity);
      } catch (err) {
        console.warn("Lỗi sync thêm sản phẩm lên cloud:", err);
      }
    }
  }
);

// Async Thunk: Cập nhật số lượng (Optimistic Update + Cloud Sync)
export const updateQuantityAsync = createAsyncThunk(
  "cart/updateQuantityAsync",
  async ({ productId, quantity }, { getState, dispatch }) => {
    dispatch(updateQuantity({ productId, quantity }));

    const isAuthenticated = getState().auth?.isAuthenticated;
    if (isAuthenticated && productId) {
      try {
        await wishlistAPI.updateQuantity(productId, quantity);
      } catch (err) {
        console.warn("Lỗi sync số lượng lên cloud:", err);
      }
    }
  }
);

// Async Thunk: Xóa sản phẩm (Optimistic Update + Cloud Sync)
export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCartAsync",
  async (productId, { getState, dispatch }) => {
    dispatch(removeFromCart(productId));

    const isAuthenticated = getState().auth?.isAuthenticated;
    if (isAuthenticated && productId) {
      try {
        await wishlistAPI.removeItem(productId);
      } catch (err) {
        console.warn("Lỗi sync xóa sản phẩm lên cloud:", err);
      }
    }
  }
);

// Async Thunk: Xóa sạch giỏ hàng
export const clearCartAsync = createAsyncThunk(
  "cart/clearCartAsync",
  async (_, { getState, dispatch }) => {
    dispatch(clearCart());

    const isAuthenticated = getState().auth?.isAuthenticated;
    if (isAuthenticated) {
      try {
        await wishlistAPI.clear();
      } catch (err) {
        console.warn("Lỗi sync xóa toàn bộ lên cloud:", err);
      }
    }
  }
);

const initialState = {
  items: [],
  syncing: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Tải dữ liệu giỏ hàng từ localStorage khi app load
    loadCartFromStorage: (state) => {
      state.items = getLocalCart();
    },

    // Thêm sản phẩm vào giỏ (Synchronous reducer)
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex((i) => i._id === product._id);

      if (existingIndex > -1) {
        state.items[existingIndex].quantity = Math.min(
          99,
          state.items[existingIndex].quantity + quantity
        );
      } else {
        state.items.push({
          _id: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          originalPrice: product.originalPrice,
          thumbnail: product.thumbnail || product.images?.[0] || "",
          quantity: Math.min(99, Math.max(1, quantity)),
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
          item.quantity = Math.min(99, quantity);
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

    // Đăng xuất: xóa sạch dữ liệu trên máy để bảo mật
    resetCartOnLogout: (state) => {
      state.items = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem("zcomputer_cart");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Auto-Merge thành công khi Đăng nhập
      .addCase(syncWishlistWithCloud.pending, (state) => {
        state.syncing = true;
      })
      .addCase(syncWishlistWithCloud.fulfilled, (state, action) => {
        state.syncing = false;
        state.items = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(syncWishlistWithCloud.rejected, (state) => {
        state.syncing = false;
      })
      // Tải Wishlist từ Cloud thành công
      .addCase(fetchCloudWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        saveCartToStorage(action.payload);
      });
  },
});

export const {
  loadCartFromStorage,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  resetCartOnLogout,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectTotalItems = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectTotalPrice = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;
