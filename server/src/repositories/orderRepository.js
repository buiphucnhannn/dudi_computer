import { BaseRepository } from "./baseRepository.js";
import { Order } from "../models/Order.js";

class OrderRepository extends BaseRepository {
  constructor() {
    super(Order);
  }

  async findWithFilters({ search, status, page = 1, limit = 20 }) {
    const query = {};

    if (search) {
      query.$or = [
        { orderCode: { $regex: search, $options: "i" } },
        { "customerInfo.fullName": { $regex: search, $options: "i" } },
        { "customerInfo.phone": { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      query.orderStatus = status;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await this.model.countDocuments(query).exec();
    const orders = await this.model
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean()
      .exec();

    return {
      orders,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }
}

export const orderRepository = new OrderRepository();
