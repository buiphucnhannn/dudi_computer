import mongoose from "mongoose";
import { Product } from "../models/Product.js";
import { News } from "../models/News.js";
import { performSeed } from "../seed.js";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/zcomputer_clone";
  try {
    const conn = await mongoose.connect(uri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);

    // Tự động kiểm tra nếu Database chưa có dữ liệu thì thực hiện seed tự động
    const productCount = await Product.countDocuments();
    const newsCount = await News.countDocuments();

    if (productCount === 0 || newsCount === 0) {
      console.log(`[Auto-Seed] Phát hiện Database chưa có đủ dữ liệu (${productCount} sản phẩm, ${newsCount} tin tức). Đang tự động nạp dữ liệu chuẩn...`);
      await performSeed();
      console.log(`[Auto-Seed] Tự động nạp dữ liệu hoàn tất!`);
    }
  } catch (error) {
    console.warn(`[Database Info] Không thể kết nối MongoDB (${error.message}).`);
    console.warn(`[Database Info] Vui lòng đảm bảo MongoDB đang chạy tại: ${uri}`);
  }
};
