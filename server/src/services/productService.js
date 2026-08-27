import mongoose from "mongoose";
import { productRepository, categoryRepository } from "../repositories/index.js";
import { Order } from "../models/Order.js";
import { ApiError } from "../utils/apiError.js";
import { sessionManager } from "../utils/sessionManager.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  deleteCloudinaryByUrl,
  deleteManyCloudinaryByUrls,
} from "../config/cloudinary.js";

// Bộ nhớ đệm in-memory theo dõi lượt xem chống Spam F5 & Bot (1 view / IP / 5 phút)
const productViewTracker = new Map();
const VIEW_COOLDOWN_MS = 5 * 60 * 1000; // 5 phút

// Tự động dọn dẹp bộ nhớ mỗi 10 phút để giải phóng RAM
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamp] of productViewTracker.entries()) {
    if (now - timestamp > VIEW_COOLDOWN_MS) {
      productViewTracker.delete(key);
    }
  }
}, 10 * 60 * 1000);

class ProductService {
  async getProducts(queryParams) {
    const {
      search,
      category,
      brand,
      condition,
      minPrice,
      maxPrice,
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
      isFlashSale,
      sort,
      page,
      limit,
      isAdmin: queryParams.isAdmin === "true" || queryParams.isAdmin === true,
    });
  }

  async getProductBySlug(slug, clientIp = "") {
    if (!slug) {
      throw new ApiError(400, "Vui lòng cung cấp slug sản phẩm");
    }

    const product = await productRepository.findBySlug(slug);
    if (!product || product.isDeleted || product.isActive === false) {
      throw new ApiError(404, "Sản phẩm không tồn tại hoặc đã tạm ngừng kinh doanh");
    }

    // Kiểm tra nếu danh mục của sản phẩm đang bị ẩn
    if (product.category && product.category.isActive === false) {
      throw new ApiError(404, "Danh mục của sản phẩm này hiện đang tạm ẩn");
    }

    // Tăng lượt xem tự động chống spam (Non-blocking):
    // Chỉ tăng nếu IP này chưa xem sản phẩm trong 15 phút qua
    const trackingKey = `${clientIp || "anon"}_${product._id}`;
    const lastViewTime = productViewTracker.get(trackingKey);
    const now = Date.now();

    if (!lastViewTime || now - lastViewTime > VIEW_COOLDOWN_MS) {
      productViewTracker.set(trackingKey, now);
      // Chạy ngầm không await để tối ưu tốc độ phản hồi 0ms cho người dùng
      productRepository.incrementViews(product._id).catch(() => {});
    }

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

    let categoryId = null;
    let categoryName =
      productData.categoryName ||
      (typeof productData.category === "string" ? productData.category : "") ||
      "Laptop";
    let categorySlug = productData.categorySlug || "";

    const categoryLookup = productData.category || productData.categoryName;
    if (categoryLookup) {
      const categoryDoc = await categoryRepository.findByNameOrSlug(categoryLookup);
      if (categoryDoc) {
        categoryId = categoryDoc._id;
        categoryName = categoryDoc.name;
        categorySlug = categoryDoc.slug;
      }
    }

    let specs = {};
    if (productData.specs) {
      try {
        specs =
          typeof productData.specs === "string"
            ? JSON.parse(productData.specs)
            : productData.specs;
      } catch (e) {
        console.warn("Lỗi parse specs:", e);
      }
    }

    let specifications = [];
    if (productData.specifications) {
      try {
        specifications =
          typeof productData.specifications === "string"
            ? JSON.parse(productData.specifications)
            : productData.specifications;
      } catch (e) {
        console.warn("Lỗi parse specifications:", e);
      }
    }

    const newProduct = {
      ...productData,
      specs: { ...(typeof productData.specs === "object" ? productData.specs : {}), ...specs },
      specifications: specifications.length > 0 ? specifications : (Array.isArray(productData.specifications) ? productData.specifications : []),
      category: categoryId || (productData.category ? productData.category : undefined),
      categoryName: categoryName,
      categorySlug: categorySlug,
      brand: (productData.brand || "ZCOMPUTER").trim(),
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
    if (updateData.category !== undefined || updateData.categoryName !== undefined) {
      const categoryLookup = updateData.category || updateData.categoryName;
      if (categoryLookup) {
        const categoryDoc = await categoryRepository.findByNameOrSlug(categoryLookup);
        if (categoryDoc) {
          updateData.category = categoryDoc._id;
          updateData.categoryName = categoryDoc.name;
          updateData.categorySlug = categoryDoc.slug;
        } else if (typeof updateData.category === "string" && !updateData.categoryName) {
          updateData.categoryName = updateData.category;
        }
      }
    }

    if (updateData.specs !== undefined) {
      try {
        updateData.specs =
          typeof updateData.specs === "string"
            ? JSON.parse(updateData.specs)
            : updateData.specs;
      } catch (e) {
        console.warn("Lỗi parse specs khi cập nhật:", e);
      }
    }

    if (updateData.specifications !== undefined) {
      try {
        updateData.specifications =
          typeof updateData.specifications === "string"
            ? JSON.parse(updateData.specifications)
            : updateData.specifications;
      } catch (e) {
        console.warn("Lỗi parse specifications khi cập nhật:", e);
      }
    }

    if (updateData.brand) {
      updateData.brand = updateData.brand.trim();
    }

    const updated = await productRepository.updateById(id, updateData);

    if (updateData.isActive !== undefined) {
      sessionManager.broadcastResourceUpdate({
        action: updateData.isActive ? "publish" : "hide",
        resourceType: "product",
        id: updated._id,
        slug: updated.slug,
        name: updated.name,
        message: updateData.isActive
          ? `Sản phẩm "${updated.name}" đã được bật kinh doanh.`
          : `Sản phẩm "${updated.name}" đã tạm ngừng kinh doanh.`,
      });
    }

    return updated;
  }

  async deleteProduct(id) {
    if (!id) {
      throw new ApiError(400, "ID sản phẩm không hợp lệ");
    }

    const product = await productRepository.findById(id);
    if (!product) {
      throw new ApiError(404, "Không tìm thấy sản phẩm để xóa");
    }

    // Kiểm tra xem sản phẩm đã phát sinh trong đơn hàng chưa
    const orderCount = await Order.countDocuments({ "items.product": id });

    if (orderCount > 0) {
      // 1. XÓA MỀM (Soft Delete): Ẩn khỏi hệ thống để bảo toàn lịch sử đơn hàng và doanh thu
      await productRepository.updateById(id, {
        isDeleted: true,
        isActive: false,
      });

      sessionManager.broadcastResourceUpdate({
        action: "delete",
        resourceType: "product",
        id: product._id,
        slug: product.slug,
        name: product.name,
        message: `Sản phẩm "${product.name}" đã ngừng kinh doanh và được gỡ khỏi hệ thống.`,
      });

      return {
        message: `Đã xóa mềm sản phẩm "${product.name}" thành công (sản phẩm đã phát sinh ${orderCount} đơn hàng nên được ẩn để bảo toàn lịch sử đơn).`,
        softDeleted: true,
      };
    }

    // 2. XÓA CỨNG (Hard Delete): Nếu sản phẩm chưa từng có đơn hàng -> Dọn dẹp toàn bộ ảnh trên Cloudinary
    const urlsToDelete = [];
    if (product.thumbnail) urlsToDelete.push(product.thumbnail);
    if (Array.isArray(product.images)) {
      for (const img of product.images) {
        if (typeof img === "string") {
          urlsToDelete.push(img);
        } else if (typeof img === "object" && img) {
          if (img.url) urlsToDelete.push(img.url);
          if (img.public_id) await deleteFromCloudinary(img.public_id);
        }
      }
    }
    if (urlsToDelete.length > 0) {
      await deleteManyCloudinaryByUrls(urlsToDelete);
    }

    await productRepository.deleteById(id);

    sessionManager.broadcastResourceUpdate({
      action: "delete",
      resourceType: "product",
      id: product._id,
      slug: product.slug,
      name: product.name,
      message: `Sản phẩm "${product.name}" đã ngừng kinh doanh và được gỡ khỏi hệ thống.`,
    });

    return {
      message: `Đã xóa vĩnh viễn sản phẩm "${product.name}" thành công!`,
      softDeleted: false,
    };
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
