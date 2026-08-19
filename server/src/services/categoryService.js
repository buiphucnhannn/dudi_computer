import { categoryRepository } from "../repositories/index.js";
import { ApiError } from "../utils/apiError.js";

class CategoryService {
  async getAllCategories() {
    return await categoryRepository.findAllWithParent();
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
}

export const categoryService = new CategoryService();
