import { newsRepository } from "../repositories/newsRepository.js";
import { NewsCategory } from "../models/NewsCategory.js";
import { ApiError } from "../utils/apiError.js";
import { sessionManager } from "../utils/sessionManager.js";

export const newsService = {
  getNews: async (params = {}) => {
    const { page = 1, limit = 10, category, search, tag } = params;

    // Lấy danh sách các chuyên mục tin tức đang kích hoạt (isActive: true)
    const activeCats = await NewsCategory.find({ isActive: true }).select("name").lean();
    const activeCatNames = activeCats.map((c) => c.name);

    const query = {
      isPublished: true,
      category: { $in: activeCatNames },
    };

    if (category && category !== "Tất cả" && category !== "all") {
      // Nếu lọc danh mục cụ thể, chỉ cho phép nếu danh mục đó đang active
      if (activeCatNames.includes(category)) {
        query.category = category;
      } else {
        return {
          items: [],
          pagination: { page: Number(page) || 1, limit: Number(limit) || 10, total: 0, totalPages: 1 },
        };
      }
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

    // Tìm bài viết
    const article = await newsRepository.findBySlug(slug);
    if (!article || !article.isPublished) {
      throw new ApiError(404, "Bài viết không tồn tại hoặc đã tạm dừng xuất bản");
    }

    // Kiểm tra xem chuyên mục của bài viết có đang bị ẩn không
    if (article.category) {
      const parentCat = await NewsCategory.findOne({ name: article.category }).lean();
      if (parentCat && parentCat.isActive === false) {
        throw new ApiError(404, "Chuyên mục của bài viết này hiện đang tạm ẩn");
      }
    }

    // Tăng lượt xem tự động
    await newsRepository.incrementViews(slug);

    // Lấy thêm bài viết liên quan cùng chuyên mục (chỉ lấy bài thuộc chuyên mục active)
    const related = await newsRepository.getRelated(article.category, article.slug, 3);

    return {
      article,
      related,
    };
  },

  getFeaturedNews: async (limit = 4) => {
    const activeCats = await NewsCategory.find({ isActive: true }).select("name").lean();
    const activeCatNames = activeCats.map((c) => c.name);

    return await newsRepository.getFeatured(Number(limit) || 4, {
      category: { $in: activeCatNames },
    });
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

    const updated = await newsRepository.update(id, data);

    if (data.isPublished !== undefined && data.isPublished !== article.isPublished) {
      sessionManager.broadcastResourceUpdate({
        action: data.isPublished ? "publish" : "hide",
        resourceType: "news",
        id: updated._id,
        slug: updated.slug,
        name: updated.title,
        message: data.isPublished ? "Bài viết đã được xuất bản công khai." : "Bài viết đã được chuyển sang bản nháp.",
      });
    }

    return updated;
  },

  deleteNews: async (id) => {
    const article = await newsRepository.findById(id);
    if (!article) {
      throw new ApiError(404, "Không tìm thấy bài viết cần xóa");
    }

    const deleted = await newsRepository.delete(id);

    sessionManager.broadcastResourceUpdate({
      action: "delete",
      resourceType: "news",
      id: article._id,
      slug: article.slug,
      name: article.title,
      message: "Bài viết này đã được xóa khỏi hệ thống.",
    });

    return deleted;
  },

  togglePublish: async (id) => {
    const article = await newsRepository.findById(id);
    if (!article) {
      throw new ApiError(404, "Không tìm thấy bài viết");
    }
    article.isPublished = !article.isPublished;
    await article.save();

    sessionManager.broadcastResourceUpdate({
      action: article.isPublished ? "publish" : "hide",
      resourceType: "news",
      id: article._id,
      slug: article.slug,
      name: article.title,
      message: article.isPublished ? "Bài viết đã được xuất bản công khai." : "Bài viết đã được chuyển sang bản nháp.",
    });

    return article;
  },
};
