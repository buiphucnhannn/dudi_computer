import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Vui lòng nhập tên hoặc tiêu đề banner"],
      trim: true,
      maxlength: [200, "Tiêu đề không được vượt quá 200 ký tự"],
    },
    imageUrl: {
      type: String,
      required: [true, "Vui lòng tải ảnh lên hoặc nhập đường dẫn ảnh"],
      trim: true,
    },
    publicId: {
      type: String,
      default: "",
      trim: true,
    },
    link: {
      type: String,
      trim: true,
      default: "/",
    },
    position: {
      type: String,
      required: true,
      enum: ["hero_slider", "promo_grid", "popup"],
      default: "hero_slider",
      index: true,
    },
    order: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

bannerSchema.index({ position: 1, order: 1, isActive: 1 });

export const Banner = mongoose.model("Banner", bannerSchema);
