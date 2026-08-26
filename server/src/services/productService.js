import mongoose from "mongoose";
import { productRepository, categoryRepository } from "../repositories/index.js";
import { ApiError } from "../utils/apiError.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

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

  async createProduct(productData, files = []) {
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

    // 1. Xử lý ảnh hiện có (nếu có gửi kèm dạng URL / object)
    let initialImages = [];
    if (productData.existingImages) {
      try {
        const parsed =
          typeof productData.existingImages === "string"
            ? JSON.parse(productData.existingImages)
            : productData.existingImages;
        if (Array.isArray(parsed)) {
          initialImages = parsed.map((item) =>
            typeof item === "string" ? { url: item, public_id: "" } : item
          );
        }
      } catch (e) {
        console.warn("Lỗi parse existingImages:", e);
      }
    } else if (Array.isArray(productData.images)) {
      initialImages = productData.images.map((item) =>
        typeof item === "string" ? { url: item, public_id: "" } : item
      );
    }

    // 2. Upload các file ảnh mới lên Cloudinary qua buffer (Song song bằng Promise.all)
    const uploadedImages = [];
    if (files && Array.isArray(files) && files.length > 0) {
      const validFiles = files.filter((f) => f && f.buffer);
      const uploadResults = await Promise.all(
        validFiles.map((file) =>
          uploadToCloudinary(file.buffer, "dudi_software/products", "image")
        )
      );
      uploadedImages.push(...uploadResults);
    }

    const allImages = [...initialImages, ...uploadedImages];

    // Nếu có thumbnail thủ công hoặc lấy ảnh đầu tiên
    let thumbnail = productData.thumbnail || "";
    if (!thumbnail && allImages.length > 0) {
      thumbnail = allImages[0].url;
    }

    const newProduct = {
      ...productData,
      slug,
      shortName: productData.shortName || name,
      stock: Number(productData.stock ?? 10),
      price: Number(price),
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : 0,
      images: allImages,
      thumbnail: thumbnail,
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

  async updateProduct(id, updateData, files = []) {
    if (!id) {
      throw new ApiError(400, "ID sản phẩm không hợp lệ");
    }

    const product = await productRepository.findById(id);
    if (!product) {
      throw new ApiError(404, "Không tìm thấy sản phẩm cần sửa");
    }

    // 1. Phân tích danh sách ảnh giữ lại (existingImages)
    let remainingImages = [];
    if (updateData.existingImages !== undefined) {
      try {
        const parsed =
          typeof updateData.existingImages === "string"
            ? JSON.parse(updateData.existingImages)
            : updateData.existingImages;
        if (Array.isArray(parsed)) {
          remainingImages = parsed.map((item) =>
            typeof item === "string" ? { url: item, public_id: "" } : item
          );
        }
      } catch (e) {
        console.warn("Lỗi parse existingImages:", e);
      }
    } else if (Array.isArray(updateData.images)) {
      remainingImages = updateData.images.map((item) =>
        typeof item === "string" ? { url: item, public_id: "" } : item
      );
    } else {
      // Giữ nguyên ảnh cũ nếu không truyền existingImages
      remainingImages = Array.isArray(product.images)
        ? product.images.map((item) =>
            typeof item === "string" ? { url: item, public_id: "" } : item
          )
        : [];
    }

    // 2. Upload các file mới lên Cloudinary song song
    const uploadedImages = [];
    if (files && Array.isArray(files) && files.length > 0) {
      const validFiles = files.filter((f) => f && f.buffer);
      const uploadResults = await Promise.all(
        validFiles.map((file) =>
          uploadToCloudinary(file.buffer, "dudi_software/products", "image")
        )
      );
      uploadedImages.push(...uploadResults);
    }

    const updatedImagesList = [...remainingImages, ...uploadedImages];

    // 3. Xóa các ảnh đã bị loại bỏ khỏi Cloudinary song song
    if (Array.isArray(product.images)) {
      const remainingPublicIds = new Set(
        updatedImagesList.map((img) => img.public_id).filter(Boolean)
      );

      const deletePromises = product.images
        .map((oldImg) => (typeof oldImg === "object" ? oldImg.public_id : null))
        .filter((oldPublicId) => oldPublicId && !remainingPublicIds.has(oldPublicId))
        .map((oldPublicId) => deleteFromCloudinary(oldPublicId));

      if (deletePromises.length > 0) {
        await Promise.allSettled(deletePromises);
      }
    }

    updateData.images = updatedImagesList;

    // Cập nhật thumbnail
    if (updatedImagesList.length > 0) {
      updateData.thumbnail = updatedImagesList[0].url;
    } else if (updateData.thumbnail) {
      updateData.thumbnail = updateData.thumbnail;
    } else {
      updateData.thumbnail = "";
    }

    // Tính toán lại % giảm giá nếu có thay đổi giá
    if (updateData.price && updateData.originalPrice) {
      const p = Number(updateData.price);
      const op = Number(updateData.originalPrice);
      if (op > p) {
        updateData.discountPercent = Math.round(((op - p) / op) * 100);
      } else {
        updateData.discountPercent = 0;
      }
    }

    if (updateData.stock !== undefined) {
      updateData.stock = Number(updateData.stock);
    }
    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
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

    // Xóa toàn bộ ảnh liên quan trên Cloudinary
    if (Array.isArray(product.images)) {
      for (const img of product.images) {
        const publicId = typeof img === "object" ? img.public_id : null;
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      }
    }

    return await productRepository.deleteById(id);
  }

  async updateStock(id, newStock) {
    if (!id) {
      throw new ApiError(400, "ID sản phẩm không hợp lệ");
    }

    const stock = Math.max(0, Number(newStock));
    const status = stock === 0 ? "out_of_stock" : "in_stock";

    if (mongoose.Types.ObjectId.isValid(id)) {
      return await productRepository.updateById(id, { stock, status });
    }

    const product = await productRepository.findOne({
      $or: [{ id: id }, { sku: id }, { slug: id }],
    });

    if (!product) {
      throw new ApiError(404, "Không tìm thấy sản phẩm");
    }

    product.stock = stock;
    product.status = status;
    return await product.save();
  }
}

export const productService = new ProductService();
