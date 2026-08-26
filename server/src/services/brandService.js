import { brandRepository } from "../repositories/brandRepository.js";
import { Product } from "../models/Product.js";
import { ApiError } from "../utils/apiError.js";

class BrandService {
  async getAllBrands(params = {}) {
    const query = { isActive: true };
    if (params.isFeatured) query.isFeatured = true;
    return await brandRepository.findAll(query);
  }

  async getAdminBrands(params = {}) {
    const query = {};
    if (params.search && params.search.trim()) {
      query.$or = [
        { name: { $regex: params.search.trim(), $options: "i" } },
        { slug: { $regex: params.search.trim(), $options: "i" } },
        { origin: { $regex: params.search.trim(), $options: "i" } },
      ];
    }
    if (params.status === "active") query.isActive = true;
    if (params.status === "inactive") query.isActive = false;

    const brands = await brandRepository.findAll(query);

    // Đếm số lượng sản phẩm thuộc mỗi thương hiệu
    const brandsWithCount = await Promise.all(
      brands.map(async (b) => {
        const productCount = await Product.countDocuments({
          brand: { $regex: new RegExp(`^${b.name}$`, "i") },
        });
        return {
          ...b,
          productCount,
        };
      })
    );

    return brandsWithCount;
  }

  async getBrandById(id) {
    const brand = await brandRepository.findById(id);
    if (!brand) {
      throw new ApiError(404, "Không tìm thấy thương hiệu yêu cầu");
    }
    return brand;
  }

  async createBrand(data) {
    const { name } = data;
    if (!name || !name.trim()) {
      throw new ApiError(400, "Tên thương hiệu là bắt buộc");
    }

    if (!data.slug) {
      data.slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const existed = await brandRepository.findBySlug(data.slug);
    if (existed) {
      throw new ApiError(409, "Thương hiệu với đường dẫn (slug) này đã tồn tại");
    }

    return await brandRepository.create(data);
  }

  async updateBrand(id, data) {
    const brand = await brandRepository.findById(id);
    if (!brand) {
      throw new ApiError(404, "Không tìm thấy thương hiệu cần cập nhật");
    }

    if (data.slug && data.slug !== brand.slug) {
      const existed = await brandRepository.findBySlug(data.slug);
      if (existed && existed._id.toString() !== id) {
        throw new ApiError(409, "Slug thương hiệu này đã tồn tại");
      }
    }

    return await brandRepository.update(id, data);
  }

  async deleteBrand(id, options = {}) {
    const brand = await brandRepository.findById(id);
    if (!brand) {
      throw new ApiError(404, "Không tìm thấy thương hiệu cần xóa");
    }

    const { force = false } = options;

    // 1. Đếm và CHẶN xóa nếu vẫn còn sản phẩm liên kết với thương hiệu này
    const brandName = (brand.name || "").trim();
    const productCount = await Product.countDocuments({
      $or: [
        { brand: { $regex: new RegExp(`^${brandName}$`, "i") } },
        { brand: brand.name },
      ],
    });

    if (productCount > 0 && !force) {
      throw new ApiError(
        400,
        `Không thể xóa thương hiệu "${brand.name}" vì đang có ${productCount} sản phẩm trong hệ thống. Vui lòng chuyển hoặc xóa các sản phẩm thuộc thương hiệu này trước!`
      );
    }

    // 2. Nếu không còn sản phẩm: Xóa vĩnh viễn
    await brandRepository.deleteById(id);
    return {
      message: `Đã xóa vĩnh viễn thương hiệu "${brand.name}" thành công!`,
      deleted: true,
      productCount: 0,
    };
  }
}

export const brandService = new BrandService();
