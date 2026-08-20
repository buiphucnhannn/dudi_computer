import { Router } from "express";
import {
  getAllNews,
  getNewsBySlug,
  getFeaturedNews,
  createNews,
} from "../controllers/newsController.js";

const router = Router();

// Lấy danh sách tin tức nổi bật
router.get("/featured", getFeaturedNews);

// Lấy danh sách tất cả tin tức (hỗ trợ query ?category=...&page=...&limit=...&search=...)
router.get("/", getAllNews);

// Lấy chi tiết bài viết theo slug
router.get("/:slug", getNewsBySlug);

// Tạo bài viết mới
router.post("/", createNews);

export default router;
