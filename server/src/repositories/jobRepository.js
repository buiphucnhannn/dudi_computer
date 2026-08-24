import { Job } from "../models/Job.js";

export const jobRepository = {
  find: async (query = {}, options = {}) => {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Job.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      Job.countDocuments(query),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  findBySlug: async (slug) => {
    return await Job.findOne({ slug, isActive: true }).lean();
  },

  findById: async (id) => {
    return await Job.findById(id);
  },

  create: async (data) => {
    return await Job.create(data);
  },

  update: async (id, data) => {
    return await Job.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  delete: async (id) => {
    return await Job.findByIdAndDelete(id);
  },
};
