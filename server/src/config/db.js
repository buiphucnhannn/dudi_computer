import mongoose from "mongoose";
import dns from "dns";
import { Product } from "../models/Product.js";
import { News } from "../models/News.js";
import { performSeed } from "../seed.js";

// Khắc phục lỗi querySrv ECONNREFUSED khi giải mã DNS SRV MongoDB Atlas trên môi trường Windows / mạng nội bộ
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (dnsErr) {
  // Bỏ qua nếu môi trường không cho phép override DNS
}

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/zcomputer_clone";
  try {
    const conn = await mongoose.connect(uri, {
      dbName: "zcomputer_clone",
      serverSelectionTimeoutMS: 5000,
    });
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
