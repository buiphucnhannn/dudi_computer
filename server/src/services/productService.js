import { productRepository, categoryRepository } from "../repositories/index.js";
import { ApiError } from "../utils/apiError.js";

class ProductService {
  async getProducts(queryParams) {
    const {
      search,
      category,
      brand,
      condition,
      minPrice,
      maxPrice,
      isHot,
      isFlashSale,
      sort = "newest",
      page = 1,
      limit = 20,
    } = queryParams;

    let categoryId = null;
    let categoryName = category;

    // Tìm Category Doc nếu client truyền slug / tên
    if (category && category !== "all") {
      const categoryDoc = await categoryRepository.findByNameOrSlug(category);
      if (categoryDoc) {
        categoryId = categoryDoc._id;
      }
    }

    return await productRepository.findWithFilters({
      search,
      categoryId,
      categoryName,
      brand,
      condition,
      minPrice,
      maxPrice,
      isHot,
      isFlashSale,
      sort,
      page,
      limit,
    });
  }

  async getProductBySlug(slug) {
    if (!slug) {
      throw new ApiError(400, "Slug sản phẩm không hợp lệ");
    }

    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new ApiError(404, "Không tìm thấy sản phẩm");
    }

    // Tăng lượt xem tự động
    await productRepository.incrementViews(product._id);

    // Lấy sản phẩm liên quan
    const relatedProducts = await productRepository.findRelated(product, 6);

    return { product, relatedProducts };
  }

  async getFlashSaleProducts(limit = 10) {
    return await productRepository.findFlashSale(Number(limit));
  }

  async createProduct(productData) {
    const { name, slug, price } = productData;
    if (!name || !slug || !price) {
      throw new ApiError(400, "Vui lòng nhập đủ các thông tin bắt buộc: tên, slug và giá");
    }

    const existed = await productRepository.findBySlug(slug);
    if (existed) {
      throw new ApiError(409, "Slug sản phẩm đã tồn tại, vui lòng chọn slug khác");
    }

    return await productRepository.create(productData);
  }
}

export const productService = new ProductService();
