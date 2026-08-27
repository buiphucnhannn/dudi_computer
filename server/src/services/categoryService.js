import { categoryRepository } from "../repositories/index.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/apiError.js";
import { sessionManager } from "../utils/sessionManager.js";
import { deleteCloudinaryByUrl } from "../config/cloudinary.js";

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

    // 3. Nếu không còn danh mục con và không còn sản phẩm: Dọn dẹp ảnh trên Cloudinary & Xóa vĩnh viễn
    if (category.image) await deleteCloudinaryByUrl(category.image);
    if (category.icon && category.icon !== category.image) await deleteCloudinaryByUrl(category.icon);

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

  getPCPartTypes() {
    return [
      { value: "cpu", label: "CPU - Bộ vi xử lý", description: "Bộ vi xử lý trung tâm (Intel / AMD)" },
      { value: "mainboard", label: "Mainboard - Bo mạch chủ", description: "Bo mạch chủ kết nối linh kiện" },
      { value: "ram", label: "RAM - Bộ nhớ trong", description: "Bộ nhớ tạm thời DDR4, DDR5" },
      { value: "vga", label: "VGA - Card màn hình", description: "Card đồ họa xử lý hình ảnh & render" },
      { value: "ssd", label: "SSD - Ổ cứng thể rắn", description: "Ổ cứng thể rắn tốc độ cao NVMe / SATA" },
      { value: "hdd", label: "HDD - Ổ cứng cơ", description: "Ổ cứng lưu trữ dung lượng lớn" },
      { value: "psu", label: "PSU - Nguồn máy tính", description: "Bộ nguồn cấp điện cho hệ thống" },
      { value: "case", label: "CASE - Vỏ máy tính", description: "Vỏ thùng máy tính, case bể cá, kính cường lực" },
      { value: "cooler", label: "Tản nhiệt Cooling", description: "Tản nhiệt nước AIO hoặc tản khí tháp đôi" },
      { value: "monitor", label: "Màn hình máy tính", description: "Màn hình Gaming, Văn phòng, Đồ họa" },
      { value: "gear", label: "Phụ Kiện Gear", description: "Bàn phím cơ, chuột gaming, tai nghe" },
    ];
  }
}

export const categoryService = new CategoryService();
