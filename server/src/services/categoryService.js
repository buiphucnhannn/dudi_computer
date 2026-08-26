import { categoryRepository } from "../repositories/index.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/apiError.js";
import { sessionManager } from "../utils/sessionManager.js";

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

    const updated = await categoryRepository.update(id, updateData);

    if (updateData.isActive !== undefined) {
      sessionManager.broadcastResourceUpdate({
        action: updateData.isActive ? "publish" : "hide",
        resourceType: "category",
        id: category._id,
        slug: category.slug,
        name: category.name,
        message: updateData.isActive
          ? `Danh mục "${category.name}" đã được bật hiển thị.`
          : `Danh mục "${category.name}" đã được tạm ẩn.`,
      });
    }

    return updated;
  }

  async deleteCategory(id, options = {}) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new ApiError(404, "Không tìm thấy danh mục cần xóa");
    }

    // 1. Kiểm tra và CHẶN xóa danh mục cha nếu vẫn còn danh mục con
    const childCount = await Category.countDocuments({ parent: category._id });
    if (childCount > 0) {
      throw new ApiError(
        400,
        `Không thể xóa danh mục "${category.name}" vì đang chứa ${childCount} danh mục con. Vui lòng xóa hoặc chuyển các danh mục con trước!`
      );
    }

    // 2. Kiểm tra và CHẶN xóa nếu vẫn còn sản phẩm thuộc danh mục
    const productCount = await Product.countDocuments({
      isDeleted: { $ne: true },
      $or: [
        { category: category._id },
        { categorySlug: category.slug },
      ],
    });

    if (productCount > 0) {
      throw new ApiError(
        400,
        `Không thể xóa danh mục "${category.name}" vì đang có ${productCount} sản phẩm liên kết. Vui lòng chuyển hoặc xóa các sản phẩm thuộc danh mục này trước!`
      );
    }

    // 3. Nếu không còn danh mục con và không còn sản phẩm: Xóa vĩnh viễn
    await categoryRepository.deleteById(id);

    sessionManager.broadcastResourceUpdate({
      action: "delete",
      resourceType: "category",
      id: category._id,
      slug: category.slug,
      name: category.name,
      message: `Danh mục "${category.name}" đã được xóa khỏi hệ thống.`,
    });

    return {
      message: `Đã xóa vĩnh viễn danh mục "${category.name}" thành công!`,
      deleted: true,
      productCount: 0,
    };
  }
}

export const categoryService = new CategoryService();
