import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề bài viết là bắt buộc"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    summary: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Nội dung bài viết là bắt buộc"],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "Tin công nghệ",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    authorName: {
      type: String,
      default: "ZCOMPUTER",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Tối ưu hóa tìm kiếm text cho tin tức
newsSchema.index({ title: "text", summary: "text", tags: "text" });

export const News = mongoose.models.News || mongoose.model("News", newsSchema);
