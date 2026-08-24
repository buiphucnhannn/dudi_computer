import { categoryRepository } from "../repositories/index.js";
import { ApiError } from "../utils/apiError.js";

class CategoryService {
  async getAllCategories() {
    return await categoryRepository.findAllWithParent();
  }

  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new ApiError(404, "Không tìm thấy danh mục yêu cầu");
    }
    return category;
  }

  async createCategory(categoryData) {
    const { name, slug } = categoryData;
    if (!name || !slug) {
      throw new ApiError(400, "Tên và slug danh mục là bắt buộc");
    }

    const existed = await categoryRepository.findBySlug(slug);
    if (existed) {
      throw new ApiError(409, "Slug danh mục này đã tồn tại");
    }

    return await categoryRepository.create(categoryData);
  }

  async updateCategory(id, updateData) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new ApiError(404, "Không tìm thấy danh mục cần cập nhật");
    }

    if (updateData.slug && updateData.slug !== category.slug) {
      const existed = await categoryRepository.findBySlug(updateData.slug);
      if (existed && existed._id.toString() !== id) {
        throw new ApiError(409, "Slug danh mục này đã tồn tại");
      }
    }

    return await categoryRepository.update(id, updateData);
  }

  async deleteCategory(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new ApiError(404, "Không tìm thấy danh mục cần xóa");
    }

    return await categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
