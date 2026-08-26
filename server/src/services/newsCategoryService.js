import { newsCategoryRepository } from "../repositories/newsCategoryRepository.js";
import { News } from "../models/News.js";
import { ApiError } from "../utils/apiError.js";
import { sessionManager } from "../utils/sessionManager.js";

export const newsCategoryService = {
  getAllCategories: async (onlyActive = false) => {
    const filter = onlyActive ? { isActive: true } : {};
    return await newsCategoryRepository.findAll(filter);
  },

  getAdminCategories: async () => {
    return await newsCategoryRepository.findAllWithCounts();
  },

  getCategoryById: async (id) => {
    const category = await newsCategoryRepository.findById(id);
    if (!category) {
      throw new ApiError(404, "Không tìm thấy danh mục tin tức");
    }
    return category;
  },

  createCategory: async (data) => {
    return await newsCategoryRepository.create(data);
  },

  updateCategory: async (id, data) => {
    const category = await newsCategoryRepository.findById(id);
    if (!category) {
      throw new ApiError(404, "Không tìm thấy danh mục tin tức để cập nhật");
    }

    const oldName = category.name;
    const updated = await newsCategoryRepository.update(id, data);

    // Nếu đổi tên danh mục -> Cập nhật tên trong tất cả bài viết liên quan
    if (data.name && data.name !== oldName) {
      await News.updateMany({ category: oldName }, { $set: { category: data.name } });
    }

    // Nếu ẩn chuyên mục -> Tự động chuyển toàn bộ bài viết trong chuyên mục về bản nháp (isPublished: false)
    if (data.isActive === false) {
      const categoryName = data.name || oldName;
      await News.updateMany(
        { category: categoryName },
        { $set: { isPublished: false } }
      );

      sessionManager.broadcastResourceUpdate({
        action: "hide",
        resourceType: "news_category",
        id: updated._id,
        name: categoryName,
        message: `Chuyên mục tin tức "${categoryName}" và toàn bộ bài viết bên trong đã được chuyển sang bản nháp.`,
      });
    } else if (data.isActive === true) {
      sessionManager.broadcastResourceUpdate({
        action: "publish",
        resourceType: "news_category",
        id: updated._id,
        name: updated.name,
        message: `Chuyên mục tin tức "${updated.name}" đã được kích hoạt hiển thị.`,
      });
    }

    return updated;
  },

  deleteCategory: async (id) => {
    const category = await newsCategoryRepository.findById(id);
    if (!category) {
      throw new ApiError(404, "Không tìm thấy danh mục tin tức để xóa");
    }

    // CHẶN XÓA nếu chuyên mục đang chứa bài viết
    const articlesCount = await News.countDocuments({ category: category.name });
    if (articlesCount > 0) {
      throw new ApiError(
        400,
        `Không thể xóa chuyên mục "${category.name}" vì đang chứa ${articlesCount} bài viết tin tức. Vui lòng chuyển các bài viết sang chuyên mục khác hoặc xóa bài viết trước!`
      );
    }

    const deleted = await newsCategoryRepository.delete(id);
    sessionManager.broadcastResourceUpdate({
      action: "delete",
      resourceType: "news_category",
      id: category._id,
      name: category.name,
      message: `Chuyên mục tin tức "${category.name}" đã được xóa khỏi hệ thống.`,
    });
    return deleted;
  },
};
