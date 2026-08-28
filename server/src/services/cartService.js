import mongoose from "mongoose";
import { cartRepository, productRepository } from "../repositories/index.js";
import { Cart } from "../models/Cart.js";
import { ApiError } from "../utils/apiError.js";
import { PRODUCTS_DATA } from "../seed.js";

class CartService {
  // Helper linh hoạt tìm kiếm hoặc tự động seed sản phẩm vào database nếu chưa có
  async resolveProduct(productId) {
    if (!productId) return null;

    let product = null;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await productRepository.findById(productId);
    }
    if (!product) {
      product = await productRepository.findOne({
        $or: [{ slug: productId }, { name: productId }],
      });
    }

    if (!product && Array.isArray(PRODUCTS_DATA)) {
      try {
        const matched = PRODUCTS_DATA.find(
          (p) => p._id === productId || p.slug === productId || p.name === productId
        );
        if (matched) {
          product = await productRepository.create({
            ...(matched._id && mongoose.Types.ObjectId.isValid(matched._id)
              ? { _id: matched._id }
              : {}),
            name: matched.name,
            slug: matched.slug,
            brand: matched.brand || "DUDI SOFTWARE",
            price: matched.price,
            originalPrice: matched.originalPrice || matched.price,
            discountPrice: matched.price,
            discountPercent: matched.discountPercent || 0,
            stock: 20,
            images:
              matched.images && matched.images.length > 0
                ? matched.images
                : ["/images/dudi/dudisoftware1.webp"],
            thumbnail:
              matched.thumbnail || matched.images?.[0] || "/images/dudi/dudisoftware1.webp",
            warranty: matched.warranty || "Bảo hành 3 - 12 Tháng",
            status: "in_stock",
          });
        }
      } catch (err) {
        console.error("Lỗi resolve product từ seed data:", err);
      }
    }

    return product;
  }

  // Helper chuẩn hóa danh sách sản phẩm trả về cho Client
  formatItems(cartDoc) {
    if (!cartDoc || !cartDoc.items) return [];

    return cartDoc.items
      .filter((item) => item.product)
      .map((item) => {
        const p = item.product;
        return {
          _id: p._id,
          id: p._id,
          name: p.name,
          shortName: p.shortName || p.name,
          sku: p.sku || "",
          slug: p.slug,
          price: p.price,
          originalPrice: p.originalPrice || p.price,
          images: p.images || [],
          thumbnail: p.thumbnail || p.images?.[0] || "/images/dudi/dudisoftware1.webp",
          quantity: item.quantity || 1,
          addedAt: item.addedAt,
          specs: p.specs || {},
        };
      });
  }

  async getCart(userId) {
    const cart = await cartRepository.findByUserId(userId);
    return this.formatItems(cart);
  }

  async syncCart(userId, localItems = []) {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Merge các items từ local vào Cart
    for (const localItem of localItems) {
      const prodId = localItem._id || localItem.id || localItem.productId || localItem.slug;
      if (!prodId) continue;

      const product = await this.resolveProduct(prodId);
      if (product) {
        const existingItem = cart.items.find(
          (i) => i.product.toString() === product._id.toString()
        );
        if (existingItem) {
          // Cập nhật số lượng
          existingItem.quantity = Math.min(
            99,
            Math.max(existingItem.quantity, Number(localItem.quantity) || 1)
          );
        } else if (cart.items.length < 100) {
          cart.items.push({
            product: product._id,
            quantity: Math.min(99, Number(localItem.quantity) || 1),
            addedAt: new Date(),
          });
        }
      }
    }

    await cart.save();

    // Lấy lại Cart đầy đủ thông tin populate
    const populated = await cartRepository.findByUserId(userId);
    return this.formatItems(populated);
  }

  async addItem(userId, productId, quantity = 1) {
    const product = await this.resolveProduct(productId);
    if (!product) {
      throw new ApiError(404, "Sản phẩm không tồn tại");
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === product._id.toString()
    );

    const qtyToAdd = Number(quantity) || 1;
    if (existingItem) {
      existingItem.quantity = Math.min(99, existingItem.quantity + qtyToAdd);
    } else {
      if (cart.items.length >= 100) {
        throw new ApiError(400, "Giỏ hàng đã đạt giới hạn tối đa 100 sản phẩm");
      }
      cart.items.push({
        product: product._id,
        quantity: Math.min(99, Math.max(1, qtyToAdd)),
        addedAt: new Date(),
      });
    }

    await cart.save();
    const populated = await cartRepository.findByUserId(userId);
    return this.formatItems(populated);
  }

  async updateQuantity(userId, productId, quantity) {
    const product = await this.resolveProduct(productId);
    if (!product) {
      throw new ApiError(404, "Sản phẩm không tồn tại");
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new ApiError(404, "Giỏ hàng không tồn tại");
    }

    const qty = Number(quantity);
    if (qty <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== product._id.toString()
      );
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === product._id.toString()
      );
      if (existingItem) {
        existingItem.quantity = Math.min(99, qty);
      }
    }

    await cart.save();
    const populated = await cartRepository.findByUserId(userId);
    return this.formatItems(populated);
  }

  async removeItem(userId, productId) {
    const product = await this.resolveProduct(productId);
    if (!product) {
      throw new ApiError(404, "Sản phẩm không tồn tại");
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new ApiError(404, "Giỏ hàng không tồn tại");
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== product._id.toString()
    );

    await cart.save();
    const populated = await cartRepository.findByUserId(userId);
    return this.formatItems(populated);
  }

  async clearCart(userId) {
    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return [];
  }
}

export const cartService = new CartService();
