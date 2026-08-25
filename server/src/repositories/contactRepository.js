import { Contact } from "../models/Contact.js";

export const contactRepository = {
  create: async (data) => {
    return await Contact.create(data);
  },

  findById: async (id) => {
    return await Contact.findById(id).lean();
  },

  find: async (filters = {}, options = {}) => {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    const query = {};

    if (filters.type && filters.type !== "all") {
      query.type = filters.type;
    }

    if (filters.status && filters.status !== "all") {
      query.status = filters.status;
    }

    if (filters.search && filters.search.trim()) {
      const regex = new RegExp(filters.search.trim(), "i");
      query.$or = [
        { fullName: regex },
        { phone: regex },
        { email: regex },
        { message: regex },
        { subject: regex },
      ];
    }

    const [items, total] = await Promise.all([
      Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Contact.countDocuments(query),
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

  updateById: async (id, data) => {
    return await Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  },

  deleteById: async (id) => {
    return await Contact.findByIdAndDelete(id).lean();
  },

  getStats: async () => {
    const [total, pending, contacted, resolved, contactCount, feedbackCount] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: "pending" }),
      Contact.countDocuments({ status: "contacted" }),
      Contact.countDocuments({ status: "resolved" }),
      Contact.countDocuments({ type: "contact" }),
      Contact.countDocuments({ type: "feedback" }),
    ]);

    return {
      total,
      pending,
      contacted,
      resolved,
      contactCount,
      feedbackCount,
    };
  },
};
