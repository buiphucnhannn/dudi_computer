import { BaseRepository } from "./baseRepository.js";
import { Wishlist } from "../models/Wishlist.js";

class WishlistRepository extends BaseRepository {
  constructor() {
    super(Wishlist);
  }

  async findByUserId(userId) {
    return await this.model
      .findOne({ user: userId })
      .populate({
        path: "items.product",
        select: "name slug price originalPrice thumbnail images stockStatus isHot",
      })
      .lean();
  }

  async findOrCreate(userId) {
    let wishlist = await this.model.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await this.model.create({ user: userId, items: [] });
    }
    return wishlist;
  }
}

export const wishlistRepository = new WishlistRepository();
