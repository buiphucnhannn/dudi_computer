import { Router } from "express";
import {
  getAllNews,
  getAdminNews,
  getNewsBySlug,
  getNewsById,
  getFeaturedNews,
  createNews,
  updateNews,
  deleteNews,
  togglePublish,
} from "../controllers/newsController.js";
import { verifyJWT, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes
router.get("/featured", getFeaturedNews);
router.get("/", getAllNews);
router.get("/detail/:id", getNewsById);
router.get("/:slug", getNewsBySlug);

// Admin routes
router.get("/admin/all", verifyJWT, requireAdmin, getAdminNews);
router.post("/", verifyJWT, requireAdmin, createNews);
router.put("/:id", verifyJWT, requireAdmin, updateNews);
router.delete("/:id", verifyJWT, requireAdmin, deleteNews);
router.patch("/:id/publish", verifyJWT, requireAdmin, togglePublish);

export default router;
