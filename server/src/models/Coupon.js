import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Mã giảm giá là bắt buộc"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Tên chương trình khuyến mãi là bắt buộc"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
      required: true,
    },
    discountValue: {
      type: Number,
      required: [true, "Giá trị giảm giá là bắt buộc"],
      min: [0, "Giá trị giảm giá không được âm"],
    },
    maxDiscountAmount: {
      type: Number,
      default: null, // Áp dụng cho loại percentage (vd: giảm 10% tối đa 500.000đ)
    },
    minOrderValue: {
      type: Number,
      default: 0, // Đơn hàng tối thiểu để áp dụng mã
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, "Ngày hết hạn là bắt buộc"],
    },
    usageLimit: {
      type: Number,
      default: 100, // Tổng số lượt sử dụng tối đa
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual kiểm tra mã có còn hiệu lực hay không
couponSchema.virtual("isExpired").get(function () {
  return this.endDate && new Date() > this.endDate;
});

couponSchema.virtual("isFullyUsed").get(function () {
  return this.usageLimit && this.usedCount >= this.usageLimit;
});

export const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
