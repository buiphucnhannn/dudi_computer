import { Promotion } from "../models/Promotion.js";

export const promotionRepository = {
  find: async (query = {}, options = {}) => {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const sort = options.sort || { priority: -1, createdAt: -1 };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Promotion.find(query)
        .populate("appliedCategories", "name slug")
        .populate("appliedProducts", "name shortName slug thumbnail price originalPrice")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Promotion.countDocuments(query),
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

  findOne: async (query = {}, options = {}) => {
    let q = Promotion.findOne(query)
      .populate("appliedCategories", "name slug")
      .populate("appliedProducts", "name shortName slug thumbnail price originalPrice");
    if (options.sort) {
      q = q.sort(options.sort);
    }
    return await q.lean();
  },

  findById: async (id) => {
    return await Promotion.findById(id)
      .populate("appliedCategories", "name slug")
      .populate("appliedProducts", "name shortName slug thumbnail price originalPrice");
  },

  create: async (data) => {
    return await Promotion.create(data);
  },

  update: async (id, data) => {
    return await Promotion.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate("appliedCategories", "name slug")
      .populate("appliedProducts", "name shortName slug thumbnail price originalPrice");
  },

  delete: async (id) => {
    return await Promotion.findByIdAndDelete(id);
  },
};
