import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartAPI } from "@/lib/api";

// Helper lưu vào localStorage
const saveCartToStorage = (items) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("dudi_cart", JSON.stringify(items));
  }
};

// Helper đọc từ localStorage
const getLocalCart = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("dudi_cart") || localStorage.getItem("zcomputer_cart");
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

// Async Thunk: Đồng bộ giỏ hàng khi Đăng nhập (Auto-Merge)
export const syncCartWithCloud = createAsyncThunk(
  "cart/syncCartWithCloud",
  async (_, { getState, rejectWithValue }) => {
    try {
      if (getState().auth?.user?.role === "admin") return [];
      const localItems = getState().cart.items || getLocalCart();
      const res = await cartAPI.sync(localItems);
      return res.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lỗi đồng bộ giỏ hàng");
    }
  }
);

export const syncWishlistWithCloud = syncCartWithCloud;

// Async Thunk: Tải Giỏ hàng từ Cloud khi vào app nếu đã đăng nhập
export const fetchCloudCart = createAsyncThunk(
  "cart/fetchCloudCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      if (getState().auth?.user?.role === "admin") return [];
      const res = await cartAPI.get();
      return res.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lỗi tải giỏ hàng");
    }
  }
);

export const fetchCloudWishlist = fetchCloudCart;

// Async Thunk: Thêm sản phẩm (Optimistic Update + Cloud Sync)
export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async ({ product, quantity = 1 }, { getState, dispatch }) => {
    if (getState().auth?.user?.role === "admin") return;

    // 1. Cập nhật state cục bộ ngay lập tức (0ms delay)
    dispatch(addToCart({ product, quantity }));

    // 2. Nếu đã đăng nhập, gửi API lưu vào MongoDB
    const isAuthenticated = getState().auth?.isAuthenticated;
    if (isAuthenticated && product?._id) {
      try {
        await cartAPI.addItem(product._id, quantity);
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
        await cartAPI.updateQuantity(productId, quantity);
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
        await cartAPI.removeItem(productId);
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
        await cartAPI.clear();
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

    // Thêm sản phẩm vào giỏ (Tự động +1 số lượng nếu sản phẩm đã tồn tại)
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      if (!product) return;

      // Không cho phép thêm sản phẩm hết hàng (stock = 0)
      if (typeof product.stock === "number" && product.stock <= 0) {
        return;
      }

      const prodId = product._id || product.id;
      const maxAvailableStock = typeof product.stock === "number" ? Math.max(1, product.stock) : 99;

      const existingIndex = state.items.findIndex(
        (i) =>
          (prodId && (i._id === prodId || i.id === prodId)) ||
          (product.slug && i.slug === product.slug)
      );

      if (existingIndex > -1) {
        const itemStock = state.items[existingIndex].stock !== undefined ? state.items[existingIndex].stock : maxAvailableStock;
        state.items[existingIndex].quantity = Math.min(
          itemStock,
          Number(state.items[existingIndex].quantity || 1) + Number(quantity)
        );
        if (product.stock !== undefined) {
          state.items[existingIndex].stock = product.stock;
        }
      } else {
        state.items.push({
          _id: product._id || product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          originalPrice: product.originalPrice || product.oldPrice,
          stock: product.stock !== undefined ? Number(product.stock) : maxAvailableStock,
          thumbnail:
            product.thumbnail ||
            product.image ||
            (Array.isArray(product.images)
              ? product.images[0]?.url || product.images[0]
              : "") ||
            "",
          quantity: Math.min(maxAvailableStock, Math.max(1, Number(quantity))),
        });
      }

      saveCartToStorage(state.items);
    },

    // Cập nhật số lượng
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const targetId = String(productId);
      if (quantity <= 0) {
        state.items = state.items.filter(
          (item) => String(item._id || item.id || item.slug) !== targetId
        );
      } else {
        const item = state.items.find(
          (item) => String(item._id || item.id || item.slug) === targetId
        );
        if (item) {
          item.quantity = Math.min(99, quantity);
        }
      }
      saveCartToStorage(state.items);
    },

    // Xóa 1 sản phẩm
    removeFromCart: (state, action) => {
      const productId = String(action.payload);
      state.items = state.items.filter(
        (item) => String(item._id || item.id || item.slug) !== productId
      );
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
        localStorage.removeItem("dudi_cart");
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
