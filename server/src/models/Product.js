import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Tên đầy đủ của sản phẩm
    name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
    },
    // Tên rút gọn thanh lịch, gọn gàng dùng cho tiêu đề hiển thị
    shortName: {
      type: String,
      trim: true,
      default: "",
    },
    // Mã SKU quản lý kho chuẩn Enterprise
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      sparse: true,
      index: true,
    },
    // Slug URL thân thiện SEO
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // Thương hiệu
    brand: {
      type: String,
      default: "ZCOMPUTER",
      trim: true,
      index: true,
    },
    // Danh mục liên kết
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },
    categoryName: {
      type: String,
      default: "Laptop",
    },
    categorySlug: {
      type: String,
      default: "laptop",
      index: true,
    },
    // Giá bán & Khuyến mãi
    price: {
      type: Number,
      required: [true, "Giá bán là bắt buộc"],
      min: 0,
      index: true,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    discountPercent: {
      type: Number,
      default: 0,
    },
    // Quản lý tồn kho
    stock: {
      type: Number,
      default: 10,
      min: 0,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    // Hình ảnh lưu trữ Cloudinary (hỗ trợ cả Object {url, public_id} và String URL)
    images: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    // Mô tả & Đánh giá
    shortDescription: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    // Thông số kỹ thuật có cấu trúc (Structured Specifications)
    specs: {
      cpu: { type: String, default: "" },
      ram: { type: String, default: "" },
      storage: { type: String, default: "" },
      gpu: { type: String, default: "" },
      screen: { type: String, default: "" },
      mainboard: { type: String, default: "" },
      psu: { type: String, default: "" },
      cooler: { type: String, default: "" },
      caseBox: { type: String, default: "" },
      size: { type: String, default: "" },
      resolution: { type: String, default: "" },
      refreshRate: { type: String, default: "" },
      panel: { type: String, default: "" },
      wattage: { type: String, default: "" },
      efficiency: { type: String, default: "" },
      chipset: { type: String, default: "" },
      socket: { type: String, default: "" },
    },
    // Mảng thuộc tính linh hoạt mở rộng
    specifications: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    // Bảo hành & Tình trạng
    warranty: {
      type: String,
      default: "Bảo hành 3 - 12 Tháng",
    },
    status: {
      type: String,
      enum: ["in_stock", "out_of_stock", "pre_order"],
      default: "in_stock",
      index: true,
    },
    condition: {
      type: String,
      default: "Mới 100%",
      index: true,
    },
    // Nhãn nổi bật
    isHot: {
      type: Boolean,
      default: false,
      index: true,
    },
    isFlashSale: {
      type: Boolean,
      default: false,
      index: true,
    },
    // Thống kê & Đánh giá
    views: {
      type: Number,
      default: 0,
    },
    ratings: {
      average: { type: Number, default: 5 },
      count: { type: Number, default: 0 },
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Fulltext Search Index
productSchema.index({
  name: "text",
  shortName: "text",
  sku: "text",
  brand: "text",
  categoryName: "text",
  tags: "text",
});

// Middleware tính toán trước khi lưu
productSchema.pre("save", function (next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discountPercent = Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  if (Array.isArray(this.images) && this.images.length > 0) {
    const firstImg = this.images[0];
    if (!this.thumbnail) {
      this.thumbnail = typeof firstImg === "string" ? firstImg : firstImg?.url || "";
    }
  }
  if (!this.shortName) {
    this.shortName = this.name;
  }
  next();
});

export const Product = mongoose.model("Product", productSchema);


