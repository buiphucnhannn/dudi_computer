import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    brand: {
      type: String,
      default: "ZCOMPUTER",
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    categoryName: {
      type: String,
      default: "Laptop Cũ",
    },
    categorySlug: {
      type: String,
      default: "laptop-cu",
    },
    price: {
      type: Number,
      required: [true, "Giá bán là bắt buộc"],
      min: 0,
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
    stock: {
      type: Number,
      default: 10,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    specifications: [
      {
        name: { type: String },
        value: { type: String },
      },
    ],
    warranty: {
      type: String,
      default: "Bảo hành 3 - 12 Tháng",
    },
    status: {
      type: String,
      enum: ["in_stock", "out_of_stock", "pre_order"],
      default: "in_stock",
    },
    isHot: {
      type: Boolean,
      default: false,
    },
    isFlashSale: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    ratings: {
      average: { type: Number, default: 5 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Tự động tính discountPercent và thumbnail
productSchema.pre("save", function (next) {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discountPercent = Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  if (!this.thumbnail && this.images && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }
  next();
});

export const Product = mongoose.model("Product", productSchema);
