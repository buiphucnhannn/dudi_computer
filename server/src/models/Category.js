import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên danh mục là bắt buộc"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    image: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    // Dùng cho menu phân cấp (cha - con)
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    // Dùng cho trang Build PC (cpu, mainboard, ram, vga, ssd, hdd, psu, case, cooler, monitor, gear)
    pcPartType: {
      type: String,
      enum: [
        "none",
        "cpu",
        "mainboard",
        "ram",
        "vga",
        "ssd",
        "hdd",
        "psu",
        "case",
        "cooler",
        "monitor",
        "gear",
      ],
      default: "none",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const Category = mongoose.model("Category", categorySchema);
