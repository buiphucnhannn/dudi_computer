import multer from "multer";

// Multer memory storage - chỉ lưu dữ liệu vào RAM dưới dạng buffer, không lưu file ra ổ đĩa server
const storage = multer.memoryStorage();

export const uploadProductImages = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Giới hạn 10MB mỗi file
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(
        new Error("Chỉ chấp nhận file hình ảnh (JPG, PNG, WEBP, GIF, SVG)"),
        false
      );
    }
  },
});
