import { Banner } from "../models/Banner.js";

export const bannerRepository = {
  create: async (data) => {
    return await Banner.create(data);
  },

  findById: async (id) => {
    return await Banner.findById(id).lean();
  },

  find: async (filters = {}) => {
    const query = {};

    if (filters.position && filters.position !== "all") {
      query.position = filters.position;
    }

    if (typeof filters.isActive === "boolean") {
      query.isActive = filters.isActive;
    } else if (filters.isActive === "true" || filters.isActive === "false") {
      query.isActive = filters.isActive === "true";
    }

    if (filters.search && filters.search.trim()) {
      const regex = new RegExp(filters.search.trim(), "i");
      query.$or = [{ title: regex }, { description: regex }, { link: regex }];
    }

    return await Banner.find(query).sort({ position: 1, order: 1, createdAt: -1 }).lean();
  },

  count: async (query = {}) => {
    return await Banner.countDocuments(query);
  },

  insertMany: async (items) => {
    return await Banner.insertMany(items);
  },

  updateById: async (id, data) => {
    return await Banner.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  },

  deleteById: async (id) => {
    return await Banner.findByIdAndDelete(id).lean();
  },
};
