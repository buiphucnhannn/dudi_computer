import { BaseRepository } from "./baseRepository.js";
import { Product } from "../models/Product.js";

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  async findWithFilters({
    search,
    categoryId,
    categoryName,
    brand,
    minPrice,
    maxPrice,
    isHot,
    isFlashSale,
    sort = "newest",
    page = 1,
    limit = 20,
  }) {
    const query = {};

    // Tìm kiếm theo từ khóa
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortName: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { categoryName: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Lọc theo Category ID hoặc Category Slug / Category Name chính xác
    if (categoryId) {
      query.category = categoryId;
    } else if (categoryName && categoryName !== "all") {
      query.$or = [
        { categorySlug: categoryName },
        { categoryName: { $regex: new RegExp(`^${categoryName}$`, "i") } },
        { categorySlug: { $regex: categoryName, $options: "i" } },
      ];
    }

    // Lọc theo Brand
    if (brand) {
      query.brand = { $regex: new RegExp(`^${brand}$`, "i") };
    }

    // Lọc theo khoảng giá
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (isHot === "true" || isHot === true) query.isHot = true;
    if (isFlashSale === "true" || isFlashSale === true) query.isFlashSale = true;

    // Sắp xếp
    let sortOptions = { createdAt: -1 };
    if (sort === "price_asc") sortOptions = { price: 1 };
    if (sort === "price_desc") sortOptions = { price: -1 };
    if (sort === "popular") sortOptions = { views: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await this.model.countDocuments(query).exec();
    const products = await this.model
      .find(query)
      .populate("category", "name slug pcPartType")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .exec();

    return {
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findBySlug(slug) {
    if (!slug) return null;
    const isObjectId = typeof slug === "string" && slug.match(/^[0-9a-fA-F]{24}$/);
    if (isObjectId) {
      const byId = await this.model.findById(slug).populate("category").exec();
      if (byId) return byId;
    }
    return await this.model.findOne({ slug }).populate("category").exec();
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
      .limit(limit)
      .exec();
  }

  async findFlashSale(limit = 10) {
    return await this.model
      .find({
        $or: [{ isFlashSale: true }, { discountPercent: { $gt: 0 } }],
      })
      .sort({ views: -1 })
      .limit(limit)
      .exec();
  }
}

export const productRepository = new ProductRepository();
