import { BaseRepository } from "./baseRepository.js";
import { Cart } from "../models/Cart.js";

class CartRepository extends BaseRepository {
  constructor() {
    super(Cart);
  }

  async findByUserId(userId) {
    return await this.model
      .findOne({ user: userId })
      .populate({
        path: "items.product",
        select: "name shortName sku slug price originalPrice thumbnail images stockStatus isFlashSale specs",
      })
      .lean();
  }

  async findOrCreate(userId) {
    let cart = await this.model.findOne({ user: userId });
    if (!cart) {
      cart = await this.model.create({ user: userId, items: [] });
    }
    return cart;
  }
}

export const cartRepository = new CartRepository();
