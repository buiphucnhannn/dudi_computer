import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Product } from "./models/Product.js";
import { Category } from "./models/Category.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORIES_DATA = [
  { name: "Laptop Cũ", slug: "laptop-cu", pcPartType: "none" },
  { name: "Laptop Gaming", slug: "laptop-gaming", pcPartType: "none" },
  { name: "Laptop Văn phòng", slug: "laptop-van-phong", pcPartType: "none" },
  { name: "Macbook", slug: "macbook", pcPartType: "none" },
  { name: "PC Cũ", slug: "pc-cu", pcPartType: "none" },
  { name: "PC Gaming", slug: "pc-gaming", pcPartType: "none" },
  { name: "PC Đồ Họa", slug: "pc-do-hoa", pcPartType: "none" },
  { name: "Chuột", slug: "chuot", pcPartType: "gear" },
  { name: "Bàn phím", slug: "ban-phim", pcPartType: "gear" },
  { name: "Màn Hình", slug: "man-hinh", pcPartType: "monitor" },
  { name: "CASE - Vỏ máy tính", slug: "case-vo-may-tinh", pcPartType: "case" },
  { name: "CPU - Bộ vi xử lý", slug: "cpu-bo-vi-xu-ly", pcPartType: "cpu" },
  { name: "PSU - Nguồn máy tính", slug: "psu-nguon-may-tinh", pcPartType: "psu" },
  { name: "Mainboard - Bo mạch chủ", slug: "mainboard-bo-mach-chu", pcPartType: "mainboard" },
  { name: "Ổ cứng HDD - SSD", slug: "o-cung-hdd-ssd", pcPartType: "ssd" },
  { name: "RAM - Bộ nhớ trong", slug: "ram-bo-nho-trong", pcPartType: "ram" },
  { name: "Tản nhiệt Cooling", slug: "tan-nhiet-cooling", pcPartType: "cooler" },
  { name: "VGA - Card màn hình", slug: "vga-card-man-hinh", pcPartType: "vga" },
];

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/zcomputer_clone";
  try {
    console.log(`[Seed] Đang kết nối tới MongoDB: ${uri}`);
    await mongoose.connect(uri);
    console.log(`[Seed] Đã kết nối thành công tới Database!`);

    // Xóa dữ liệu cũ
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log(`[Seed] Đã dọn dẹp dữ liệu cũ.`);

    // 1. Chèn Categories
    const createdCategories = await Category.insertMany(CATEGORIES_DATA);
    console.log(`[Seed] Đã tạo ${createdCategories.length} danh mục.`);

    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name.toLowerCase()] = cat._id;
      categoryMap[cat.slug] = cat._id;
    });

    // 2. Đọc file sản phẩm đã cào từ zcomputer.vn
    const dataPath = path.join(__dirname, "../../client/src/data/products.json");
    if (!fs.existsSync(dataPath)) {
      console.error(`[Seed Lỗi] Không tìm thấy file dữ liệu tại ${dataPath}`);
      process.exit(1);
    }

    const rawProducts = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    console.log(`[Seed] Đang nạp ${rawProducts.length} sản phẩm thực tế...`);

    const productsToInsert = rawProducts.map((p, index) => {
      const catSlug = p.categorySlug || "";
      const catName = p.categoryName || "Laptop Cũ";
      const matchedCatId =
        categoryMap[catName.toLowerCase()] ||
        categoryMap[catSlug] ||
        createdCategories[0]._id;

      return {
        ...(p._id && mongoose.Types.ObjectId.isValid(p._id) ? { _id: p._id } : {}),
        name: p.name,
        slug: p.slug,
        brand: p.brand || "ZCOMPUTER",
        category: matchedCatId,
        categoryName: catName,
        price: p.price,
        originalPrice: p.originalPrice || p.price,
        discountPrice: p.price,
        discountPercent: p.discountPercent || 0,
        stock: 20,
        images: p.images && p.images.length > 0 ? p.images : ["https://zcomputer.vn/logo-main.png"],
        thumbnail: p.thumbnail || p.images?.[0] || "https://zcomputer.vn/logo-main.png",
        warranty: p.warranty || "Bảo hành 3 - 12 Tháng",
        status: "in_stock",
        isHot: index < 15,
        isFlashSale: index % 4 === 0,
        views: Math.floor(Math.random() * 80) + 12,
        ratings: {
          average: 5,
          count: Math.floor(Math.random() * 20) + 5,
        },
      };
    });

    await Product.insertMany(productsToInsert);
    console.log(`🎉 [Seed Thành Công] Đã nạp thành công ${productsToInsert.length} sản phẩm vào MongoDB!`);

    await mongoose.disconnect();
    console.log(`[Seed] Ngắt kết nối Database hoàn tất.`);
  } catch (error) {
    console.error(`[Seed Lỗi]`, error);
    process.exit(1);
  }
};

seedDatabase();
