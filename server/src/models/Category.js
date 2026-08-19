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
    },
    image: {
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
    },
    // Dùng cho trang Build PC (cpu, mainboard, ram, vga, ssd, hdd, psu, case, cooler, monitor, keyboard, mouse)
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
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
