import { BaseRepository } from "./baseRepository.js";
import { Order } from "../models/Order.js";

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  async findByUserId(userId) {
    return await this.model
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.product", "name thumbnail price")
      .exec();
  }

  async findOrderDetail(orderId) {
    return await this.model
      .findById(orderId)
      .populate("user", "name email phone")
      .populate("items.product", "name thumbnail price slug")
      .exec();
  }
}

export const orderRepository = new OrderRepository();
