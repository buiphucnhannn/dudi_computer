import { newsCategoryRepository } from "../repositories/newsCategoryRepository.js";

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
      const error = new Error("Không tìm thấy danh mục tin tức");
      error.statusCode = 404;
      throw error;
    }
    return category;
  },

  createCategory: async (data) => {
    return await newsCategoryRepository.create(data);
  },

  updateCategory: async (id, data) => {
    const category = await newsCategoryRepository.findById(id);
    if (!category) {
      const error = new Error("Không tìm thấy danh mục tin tức để cập nhật");
      error.statusCode = 404;
      throw error;
    }
    return await newsCategoryRepository.update(id, data);
  },

  deleteCategory: async (id) => {
    const category = await newsCategoryRepository.findById(id);
    if (!category) {
      const error = new Error("Không tìm thấy danh mục tin tức để xóa");
      error.statusCode = 404;
      throw error;
    }
    return await newsCategoryRepository.delete(id);
  },
};
