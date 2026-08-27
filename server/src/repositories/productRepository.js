import { BaseRepository } from "./baseRepository.js";
import { Product } from "../models/Product.js";

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  async findWithFilters({
    search,
    categoryId,
    categoryIds,
    categoryName,
    brand,
    condition,
    minPrice,
    maxPrice,
    isHot,
    isFlashSale,
    discount,
    sort = "newest",
    page = 1,
    limit = 20,
    isAdmin = false,
  }) {
    const andConditions = [{ isDeleted: { $ne: true } }];

    // Mặc định khách hàng chỉ xem sản phẩm active (trừ khi có cờ admin)
    if (!isAdmin) {
      andConditions.push({ isActive: { $ne: false } });
    }

    // Tìm kiếm theo từ khóa
    if (search && search.trim()) {
      const s = search.trim();
      andConditions.push({
        $or: [
          { name: { $regex: s, $options: "i" } },
          { shortName: { $regex: s, $options: "i" } },
          { sku: { $regex: s, $options: "i" } },
          { brand: { $regex: s, $options: "i" } },
          { categoryName: { $regex: s, $options: "i" } },
          { shortDescription: { $regex: s, $options: "i" } },
          { tags: { $in: [new RegExp(s, "i")] } },
        ],
      });
    }

    // Lọc theo Category ID / Category IDs hoặc Category Slug / Category Name
    if (categoryIds && categoryIds.length > 0) {
      andConditions.push({
        $or: [
          { category: { $in: categoryIds } },
          { categorySlug: categoryName },
          { categoryName: { $regex: new RegExp(`^${categoryName}$`, "i") } },
        ],
      });
    } else if (categoryId) {
      andConditions.push({ category: categoryId });
    } else if (categoryName && categoryName !== "all") {
      andConditions.push({
        $or: [
          { categorySlug: categoryName },
          { categoryName: { $regex: new RegExp(`^${categoryName}$`, "i") } },
          { categorySlug: { $regex: categoryName, $options: "i" } },
        ],
      });
    }

    // Lọc theo Brand (hỗ trợ 1 hoặc nhiều thương hiệu phân tách bằng dấu phẩy)
    if (brand) {
      const brandList = Array.isArray(brand)
        ? brand
        : String(brand).split(",").map((b) => b.trim()).filter(Boolean);

      if (brandList.length === 1) {
        andConditions.push({ brand: { $regex: new RegExp(`^${brandList[0]}$`, "i") } });
      } else if (brandList.length > 1) {
        const regexPatterns = brandList.map((b) => `^${b}$`).join("|");
        andConditions.push({ brand: { $regex: new RegExp(regexPatterns, "i") } });
      }
    }

    // Lọc theo Tình trạng (Mới / Cũ / Like New)
    if (condition) {
      if (condition === "new" || condition === "moi") {
        andConditions.push({ condition: { $regex: /Mới|New/i } });
      } else if (condition === "used" || condition === "cu" || condition === "like_new") {
        andConditions.push({ condition: { $regex: /Cũ|Like New|99%|Đã qua sử dụng|Lướt|Second Hand/i } });
      } else {
        andConditions.push({ condition: { $regex: condition, $options: "i" } });
      }
    }

    // Lọc theo khoảng giá
    if (minPrice || maxPrice) {
      const priceCond = {};
      if (minPrice) priceCond.$gte = Number(minPrice);
      if (maxPrice) priceCond.$lte = Number(maxPrice);
      andConditions.push({ price: priceCond });
    }

    if (isFlashSale === "true" || isFlashSale === true) {
      andConditions.push({ isFlashSale: true });
    }

    if (discount === "true" || discount === true) {
      andConditions.push({
        $or: [
          { discountPercent: { $gt: 0 } },
          { $expr: { $gt: ["$originalPrice", "$price"] } },
        ],
      });
    }

    const query = andConditions.length > 1 ? { $and: andConditions } : andConditions[0] || {};

    // Sắp xếp
    let sortOptions = { soldCount: -1, views: -1, createdAt: -1 };
    if (sort === "price_asc" || sort === "price-low") sortOptions = { price: 1 };
    if (sort === "price_desc" || sort === "price-high") sortOptions = { price: -1 };
    if (sort === "popular") sortOptions = { views: -1, soldCount: -1 };
    if (sort === "best_seller" || sort === "sold_desc" || sort === "selling") sortOptions = { soldCount: -1, views: -1 };
    if (sort === "newest") sortOptions = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await this.model.countDocuments(query).exec();
    const products = await this.model
      .find(query)
      .select("-description")
      .populate("category", "name slug pcPartType")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .lean()
      .exec();

    return {
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)) || 1,
      },
    };
  }

  async findBySlug(slug) {
    if (!slug) return null;
    const isObjectId = typeof slug === "string" && slug.match(/^[0-9a-fA-F]{24}$/);
    if (isObjectId) {
      const byId = await this.model.findById(slug).populate("category").lean().exec();
      if (byId) return byId;
    }
    return await this.model.findOne({ slug }).populate("category").lean().exec();
  }

  async incrementViews(productId) {
    return await this.model.findByIdAndUpdate(
      productId,
      { $inc: { views: 1 } },
      { new: true }
    ).exec();
  }

  async findRelated(product, limit = 6) {
    return await this.model
      .find({
        $or: [
          { category: product.category?._id || product.category },
          { brand: product.brand },
        ],
        _id: { $ne: product._id },
      })
      .select("-description")
      .limit(limit)
      .lean()
      .exec();
  }

  async findFlashSale(limit = 10) {
    return await this.model
      .find({
        $or: [{ isFlashSale: true }, { discountPercent: { $gt: 0 } }],
      })
      .select("-description")
      .sort({ views: -1 })
      .limit(limit)
      .lean()
      .exec();
  }
}

export const productRepository = new ProductRepository();
