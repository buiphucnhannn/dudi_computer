import { News } from "../models/News.js";

export const newsRepository = {
  find: async (query = {}, options = {}) => {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 10));
    const sort = options.sort || { createdAt: -1 };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      News.find(query).sort(sort).skip(skip).limit(limit).lean(),
      News.countDocuments(query),
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

  findBySlug: async (slug) => {
    return await News.findOne({ slug, isPublished: true });
  },

  findById: async (id) => {
    return await News.findById(id);
  },

  incrementViews: async (slug) => {
    return await News.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    );
  },

  getFeatured: async (limit = 4) => {
    return await News.find({ isPublished: true })
      .sort({ views: -1, createdAt: -1 })
      .limit(limit)
      .lean();
  },

  getRelated: async (category, excludeSlug, limit = 3) => {
    return await News.find({
      isPublished: true,
      category,
      slug: { $ne: excludeSlug },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  },

  create: async (data) => {
    return await News.create(data);
  },

  update: async (id, data) => {
    return await News.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  delete: async (id) => {
    return await News.findByIdAndDelete(id);
  },
};
