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
    const { name, price } = productData;
    let { slug } = productData;

    if (!name || !price) {
      throw new ApiError(400, "Vui lòng nhập đủ các thông tin bắt buộc: tên và giá");
    }

    if (!slug) {
      slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const existed = await productRepository.findBySlug(slug);
    if (existed) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const newProduct = {
      ...productData,
      slug,
      shortName: productData.shortName || name,
      stock: Number(productData.stock ?? 10),
      price: Number(price),
    };

    const createdProduct = await productRepository.create(newProduct);

    // Tự động tạo thông báo Admin cho sản phẩm mới
    try {
      const { notificationService } = await import("./notificationService.js");
      await notificationService.createNotification({
        title: `Sản phẩm mới: ${createdProduct.name}`,
        message: `Đã thêm sản phẩm "${createdProduct.name}" vào kho với giá ${new Intl.NumberFormat("vi-VN").format(createdProduct.price || 0)}₫ (Tồn kho: ${createdProduct.stock})`,
        type: "product",
        link: "/admin/products",
        entityId: createdProduct._id,
        entityType: "Product",
        metadata: {
          productName: createdProduct.name,
          price: createdProduct.price,
          stock: createdProduct.stock,
        },
      });
    } catch (notifErr) {
      console.error("Lỗi khi tạo notification cho sản phẩm mới:", notifErr);
    }

    return createdProduct;
  }

  async updateProduct(id, updateData) {
    if (!id) {
      throw new ApiError(400, "ID sản phẩm không hợp lệ");
    }

    const product = await productRepository.findById(id);
    if (!product) {
      throw new ApiError(404, "Không tìm thấy sản phẩm cần sửa");
    }

    // If price / originalPrice changed, calculate discount
    if (updateData.price && updateData.originalPrice) {
      const p = Number(updateData.price);
      const op = Number(updateData.originalPrice);
      if (op > p) {
        updateData.discountPercent = Math.round(((op - p) / op) * 100);
      }
    }

    return await productRepository.updateById(id, updateData);
  }

  async deleteProduct(id) {
    if (!id) {
      throw new ApiError(400, "ID sản phẩm không hợp lệ");
    }

    const product = await productRepository.findById(id);
    if (!product) {
      throw new ApiError(404, "Không tìm thấy sản phẩm để xóa");
    }

    return await productRepository.deleteById(id);
  }

  async updateStock(id, newStock) {
    if (!id) {
      throw new ApiError(400, "ID sản phẩm không hợp lệ");
    }

    const stock = Math.max(0, Number(newStock));
    const status = stock === 0 ? "out_of_stock" : "in_stock";

    return await productRepository.updateById(id, { stock, status });
  }
}

export const productService = new ProductService();
