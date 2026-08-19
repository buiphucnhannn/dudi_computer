import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/zcomputer_clone";
  try {
    const conn = await mongoose.connect(uri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Info] Không thể kết nối MongoDB cục bộ (${error.message}).`);
    console.warn(`[Database Info] Server vẫn hoạt động. Vui lòng bật MongoDB hoặc cập nhật MONGODB_URI trong server/.env khi cần lưu DB.`);
  }
};
