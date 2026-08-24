import { NewsCategory } from "../models/NewsCategory.js";
import { News } from "../models/News.js";

export const newsCategoryRepository = {
  findAll: async (filter = {}) => {
    return await NewsCategory.find(filter).sort({ order: 1, createdAt: -1 }).lean();
  },

  findAllWithCounts: async () => {
    const categories = await NewsCategory.find().sort({ order: 1, createdAt: -1 }).lean();

    // Đếm số lượng bài viết của từng danh mục
    const counts = await News.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    counts.forEach((c) => {
      if (c._id) countMap[c._id] = c.count;
    });

    return categories.map((cat) => ({
      ...cat,
      articleCount: countMap[cat.name] || 0,
    }));
  },

  findById: async (id) => {
    return await NewsCategory.findById(id);
  },

  findBySlug: async (slug) => {
    return await NewsCategory.findOne({ slug });
  },

  create: async (data) => {
    const category = new NewsCategory(data);
    return await category.save();
  },

  update: async (id, data) => {
    return await NewsCategory.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  delete: async (id) => {
    return await NewsCategory.findByIdAndDelete(id);
  },
};
