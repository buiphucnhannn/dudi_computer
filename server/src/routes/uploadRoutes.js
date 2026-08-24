import { Router } from "express";
import multer from "multer";
import { uploadController } from "../controllers/uploadController.js";
import { verifyJWT, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Multer memory storage để nhận file dạng buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Tối đa 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file định dạng hình ảnh (JPG, PNG, WEBP, GIF, SVG)"), false);
    }
  },
});

// Upload 1 ảnh (Yêu cầu đăng nhập Admin)
router.post(
  "/image",
  verifyJWT,
  requireAdmin,
  upload.single("image"),
  uploadController.uploadSingleImage
);

// Upload nhiều ảnh
router.post(
  "/images",
  verifyJWT,
  requireAdmin,
  upload.array("images", 10),
  uploadController.uploadMultipleImages
);

export default router;
