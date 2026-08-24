import mongoose from "mongoose";

const newsCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên chuyên mục là bắt buộc"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Slug chuyên mục là bắt buộc"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    color: {
      type: String,
      default: "red", // 'red' | 'blue' | 'emerald' | 'purple' | 'amber' | 'cyan'
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const NewsCategory =
  mongoose.models.NewsCategory ||
  mongoose.model("NewsCategory", newsCategorySchema);
