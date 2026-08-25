import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên chương trình khuyến mãi là bắt buộc"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    banner: {
      type: String,
      default: "",
    },
    // Loại giảm giá
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
      required: true,
    },
    // Giá trị giảm (% hoặc VNĐ)
    discountValue: {
      type: Number,
      required: [true, "Giá trị giảm giá là bắt buộc"],
      min: [0, "Giá trị giảm giá không được âm"],
    },
    // Phạm vi áp dụng
    applyScope: {
      type: String,
      enum: ["all", "category", "products"],
      default: "products",
    },
    // Danh mục được áp dụng (khi scope = "category")
    appliedCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    // Sản phẩm được áp dụng (khi scope = "products")
    appliedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, "Ngày kết thúc khuyến mãi là bắt buộc"],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    // Đánh dấu promotion này là Flash Sale (hiển thị trên trang chủ với countdown timer)
    isFlashSale: {
      type: Boolean,
      default: false,
      index: true,
    },
    // Ưu tiên khi sản phẩm nằm trong nhiều chương trình (số lớn = ưu tiên cao)
    priority: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual kiểm tra còn hiệu lực
promotionSchema.virtual("isExpired").get(function () {
  return this.endDate && new Date() > this.endDate;
});

promotionSchema.virtual("isUpcoming").get(function () {
  return this.startDate && new Date() < this.startDate;
});

// Index tìm kiếm
promotionSchema.index({ name: "text", description: "text" });

export const Promotion =
  mongoose.models.Promotion || mongoose.model("Promotion", promotionSchema);
