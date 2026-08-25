import mongoose from "mongoose";
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

  async findMyOrders({ userId, phone, email, status, search, page = 1, limit = 50 }) {
    const query = {};
    const orConditions = [];

    if (userId && mongoose.Types.ObjectId.isValid(String(userId))) {
      orConditions.push({ user: new mongoose.Types.ObjectId(String(userId)) });
    }
    if (phone) {
      orConditions.push({ "customerInfo.phone": String(phone).trim() });
    }
    if (email) {
      orConditions.push({ "customerInfo.email": String(email).trim().toLowerCase() });
    }

    if (orConditions.length > 0) {
      query.$or = orConditions;
    }

    if (status && status !== "all") {
      query.orderStatus = status;
    }

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      const searchCondition = {
        $or: [
          { orderCode: searchRegex },
          { "items.name": searchRegex },
          { "customerInfo.phone": searchRegex },
        ],
      };

      if (query.$or) {
        query.$and = [{ $or: query.$or }, searchCondition];
        delete query.$or;
      } else {
        query.$or = searchCondition.$or;
      }
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

  async findByCodeOrId(codeOrId) {
    if (!codeOrId) return null;
    const trimmed = String(codeOrId).trim();
    if (mongoose.Types.ObjectId.isValid(trimmed)) {
      const byId = await this.model.findById(trimmed).lean().exec();
      if (byId) return byId;
    }
    return await this.model
      .findOne({
        $or: [
          { orderCode: trimmed.toUpperCase() },
          { orderCode: trimmed },
          { "customerInfo.phone": trimmed },
        ],
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }
}

export const orderRepository = new OrderRepository();
