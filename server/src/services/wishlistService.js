import { wishlistRepository, productRepository } from "../repositories/index.js";
import { Wishlist } from "../models/Wishlist.js";
import { ApiError } from "../utils/apiError.js";

class WishlistService {
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
        const prodId = local._id || local.productId || local.product;
        if (!prodId) continue;

        // Kiểm tra sản phẩm có tồn tại trong database không
        const productExists = await productRepository.findById(prodId);
        if (!productExists) continue;

        const existingItem = wishlist.items.find(
          (item) => item.product.toString() === prodId.toString()
        );

        if (existingItem) {
          existingItem.quantity = Math.min(
            99,
            existingItem.quantity + (Number(local.quantity) || 1)
          );
        } else if (wishlist.items.length < 100) {
          wishlist.items.push({
            product: prodId,
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

    const product = await productRepository.findById(productId);
    if (!product) {
      throw new ApiError(404, "Sản phẩm không tồn tại");
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    const existingItem = wishlist.items.find(
      (item) => item.product.toString() === productId.toString()
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
        product: productId,
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

    if (qty <= 0) {
      wishlist.items = wishlist.items.filter(
        (item) => item.product.toString() !== productId.toString()
      );
    } else {
      const existingItem = wishlist.items.find(
        (item) => item.product.toString() === productId.toString()
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

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId.toString()
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
