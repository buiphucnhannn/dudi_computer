import { newsRepository } from "../repositories/newsRepository.js";
import { ApiError } from "../utils/apiError.js";

export const newsService = {
  getNews: async (params = {}) => {
    const { page = 1, limit = 10, category, search, tag } = params;
    const query = { isPublished: true };

    if (category && category !== "Tất cả" && category !== "all") {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { summary: { $regex: search.trim(), $options: "i" } },
      ];
    }

    return await newsRepository.find(query, { page, limit });
  },

  getNewsBySlug: async (slug) => {
    if (!slug) {
      throw new ApiError(400, "Slug bài viết không hợp lệ");
    }

    // Tăng lượt xem tự động
    const article = await newsRepository.incrementViews(slug);
    if (!article) {
      throw new ApiError(404, "Không tìm thấy bài viết tin tức yêu cầu");
    }

    // Lấy thêm bài viết liên quan cùng chuyên mục
    const related = await newsRepository.getRelated(article.category, article.slug, 3);

    return {
      article,
      related,
    };
  },

  getFeaturedNews: async (limit = 4) => {
    return await newsRepository.getFeatured(Number(limit) || 4);
  },

  getAdminNews: async (params = {}) => {
    const { page = 1, limit = 15, category, search, isPublished } = params;
    const query = {};

    if (category && category !== "Tất cả" && category !== "all") {
      query.category = category;
    }

    if (isPublished !== undefined && isPublished !== "all") {
      query.isPublished = isPublished === "true" || isPublished === true;
    }

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { summary: { $regex: search.trim(), $options: "i" } },
      ];
    }

    return await newsRepository.find(query, { page, limit });
  },

  getNewsById: async (id) => {
    const article = await newsRepository.findById(id);
    if (!article) {
      throw new ApiError(404, "Không tìm thấy bài viết tin tức yêu cầu");
    }
    return article;
  },

  createNews: async (data) => {
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }
    return await newsRepository.create(data);
  },

  updateNews: async (id, data) => {
    const article = await newsRepository.findById(id);
    if (!article) {
      throw new ApiError(404, "Không tìm thấy bài viết cần cập nhật");
    }
    return await newsRepository.update(id, data);
  },

  deleteNews: async (id) => {
    const article = await newsRepository.findById(id);
    if (!article) {
      throw new ApiError(404, "Không tìm thấy bài viết cần xóa");
    }
    return await newsRepository.delete(id);
  },

  togglePublish: async (id) => {
    const article = await newsRepository.findById(id);
    if (!article) {
      throw new ApiError(404, "Không tìm thấy bài viết");
    }
    article.isPublished = !article.isPublished;
    await article.save();
    return article;
  },
};
