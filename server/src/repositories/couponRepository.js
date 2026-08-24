import { Coupon } from "../models/Coupon.js";

export const couponRepository = {
  find: async (query = {}, options = {}) => {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const sort = options.sort || { createdAt: -1 };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Coupon.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Coupon.countDocuments(query),
    ]);

    return {
      items: items || [],
      pagination: {
        page,
        limit,
        total: total || 0,
        totalPages: Math.ceil((total || 0) / limit) || 1,
      },
    };
  },

  findById: async (id) => {
    return await Coupon.findById(id);
  },

  findByCode: async (code) => {
    return await Coupon.findOne({ code: code.toUpperCase() });
  },

  create: async (data) => {
    return await Coupon.create(data);
  },

  update: async (id, data) => {
    return await Coupon.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  delete: async (id) => {
    return await Coupon.findByIdAndDelete(id);
  },

  incrementUsage: async (code) => {
    return await Coupon.findOneAndUpdate(
      { code: code.toUpperCase() },
      { $inc: { usedCount: 1 } },
      { new: true }
    );
  },
};
