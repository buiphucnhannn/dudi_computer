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

  createNews: async (data) => {
    return await newsRepository.create(data);
  },
};
