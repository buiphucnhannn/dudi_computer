import mongoose from "mongoose";
import { wishlistRepository, productRepository } from "../repositories/index.js";
import { Wishlist } from "../models/Wishlist.js";
import { ApiError } from "../utils/apiError.js";
import { PRODUCTS_DATA } from "../seed.js";

class WishlistService {
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
            brand: matched.brand || "ZCOMPUTER",
            price: matched.price,
            originalPrice: matched.originalPrice || matched.price,
            discountPrice: matched.price,
            discountPercent: matched.discountPercent || 0,
            stock: 20,
            images:
              matched.images && matched.images.length > 0
                ? matched.images
                : ["https://zcomputer.vn/logo-main.png"],
            thumbnail:
              matched.thumbnail || matched.images?.[0] || "https://zcomputer.vn/logo-main.png",
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
  formatItems(wishlistDoc) {
    if (!wishlistDoc || !wishlistDoc.items) return [];

    return wishlistDoc.items
      .filter((item) => item && item.product)
      .map((item) => {
        const prod = item.product;
        return {
          _id: prod._id,
          name: prod.name,
          slug: prod.slug,
          price: prod.price,
          originalPrice: prod.originalPrice,
          thumbnail: prod.thumbnail || prod.images?.[0] || "",
          stockStatus: prod.stockStatus,
          quantity: item.quantity,
          addedAt: item.addedAt,
        };
      });
  }

  async getWishlist(userId) {
    const wishlist = await wishlistRepository.findByUserId(userId);
    return this.formatItems(wishlist);
  }

  async syncWishlist(userId, localItems = []) {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    if (Array.isArray(localItems) && localItems.length > 0) {
      for (const local of localItems) {
        const prodId = local._id || local.productId || local.product || local.slug;
        if (!prodId) continue;

        const product = await this.resolveProduct(prodId);
        if (!product) continue;

        const actualId = product._id;
        const existingItem = wishlist.items.find(
          (item) => item.product.toString() === actualId.toString()
        );

        if (existingItem) {
          existingItem.quantity = Math.min(
            99,
            existingItem.quantity + (Number(local.quantity) || 1)
          );
        } else if (wishlist.items.length < 100) {
          wishlist.items.push({
            product: actualId,
            quantity: Math.min(99, Math.max(1, Number(local.quantity) || 1)),
            addedAt: new Date(),
          });
        }
      }

      await wishlist.save();
    }

    const populated = await wishlistRepository.findByUserId(userId);
    return this.formatItems(populated);
  }

  async addItem(userId, { productId, quantity = 1 }) {
    if (!productId) {
      throw new ApiError(400, "Thiếu ID sản phẩm");
    }

    const product = await this.resolveProduct(productId);
    if (!product) {
      throw new ApiError(404, "Sản phẩm không tồn tại");
    }

    const actualId = product._id;
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    const existingItem = wishlist.items.find(
      (item) => item.product.toString() === actualId.toString()
    );

    if (existingItem) {
      existingItem.quantity = Math.min(
        99,
        existingItem.quantity + (Number(quantity) || 1)
      );
    } else {
      if (wishlist.items.length >= 100) {
        throw new ApiError(400, "Danh sách yêu thích đã đạt tối đa 100 sản phẩm");
      }
      wishlist.items.push({
        product: actualId,
        quantity: Math.min(99, Math.max(1, Number(quantity) || 1)),
        addedAt: new Date(),
      });
    }

    await wishlist.save();
    const populated = await wishlistRepository.findByUserId(userId);
    return this.formatItems(populated);
  }

  async updateQuantity(userId, { productId, quantity }) {
    if (!productId) {
      throw new ApiError(400, "Thiếu ID sản phẩm");
    }

    const qty = Number(quantity);
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return [];
    }

    const product = await this.resolveProduct(productId);
    const targetIdStr = product ? product._id.toString() : productId.toString();

    if (qty <= 0) {
      wishlist.items = wishlist.items.filter(
        (item) => item.product.toString() !== targetIdStr
      );
    } else {
      const existingItem = wishlist.items.find(
        (item) => item.product.toString() === targetIdStr
      );
      if (existingItem) {
        existingItem.quantity = Math.min(99, qty);
      }
    }

    await wishlist.save();
    const populated = await wishlistRepository.findByUserId(userId);
    return this.formatItems(populated);
  }

  async removeItem(userId, productId) {
    if (!productId) {
      throw new ApiError(400, "Thiếu ID sản phẩm cần xóa");
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return [];
    }

    const product = await this.resolveProduct(productId);
    const targetIdStr = product ? product._id.toString() : productId.toString();

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== targetIdStr
    );

    await wishlist.save();
    const populated = await wishlistRepository.findByUserId(userId);
    return this.formatItems(populated);
  }

  async clearWishlist(userId) {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (wishlist) {
      wishlist.items = [];
      await wishlist.save();
    }
    return [];
  }
}

export const wishlistService = new WishlistService();
