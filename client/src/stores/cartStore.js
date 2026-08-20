import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [],
  
  loadCart: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("zcomputer_cart");
      if (saved) {
        try {
          set({ items: JSON.parse(saved) });
        } catch (e) {
          console.error("Lỗi đọc giỏ hàng", e);
        }
      }
    }
  },

  // Thêm sản phẩm vào giỏ
  addToCart: (product, quantity = 1) => {
    const { items } = get();
    const existingIndex = items.findIndex((i) => i._id === product._id);
    let updatedItems;

    if (existingIndex > -1) {
      updatedItems = [...items];
      updatedItems[existingIndex].quantity += quantity;
    } else {
      updatedItems = [
        ...items,
        {
          _id: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          originalPrice: product.originalPrice,
          thumbnail: product.thumbnail || product.images?.[0] || "",
          quantity,
        },
      ];
    }

    set({ items: updatedItems });
    if (typeof window !== "undefined") {
      localStorage.setItem("zcomputer_cart", JSON.stringify(updatedItems));
    }
  },

  // Cập nhật số lượng
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    const updatedItems = get().items.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );
    set({ items: updatedItems });
    if (typeof window !== "undefined") {
      localStorage.setItem("zcomputer_cart", JSON.stringify(updatedItems));
    }
  },

  // Xóa sản phẩm khỏi giỏ
  removeFromCart: (productId) => {
    const updatedItems = get().items.filter((item) => item._id !== productId);
    set({ items: updatedItems });
    if (typeof window !== "undefined") {
      localStorage.setItem("zcomputer_cart", JSON.stringify(updatedItems));
    }
  },

  // Xóa sạch giỏ hàng
  clearCart: () => {
    set({ items: [] });
    if (typeof window !== "undefined") {
      localStorage.removeItem("zcomputer_cart");
    }
  },

  // Tổng số lượng item
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  // Tổng tiền
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
