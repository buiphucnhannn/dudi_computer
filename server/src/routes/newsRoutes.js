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
import { verifyJWT, requireContentAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes
router.get("/featured", getFeaturedNews);
router.get("/", getAllNews);
router.get("/detail/:id", getNewsById);
router.get("/:slug", getNewsBySlug);

// Admin routes
router.get("/admin/all", verifyJWT, requireContentAdmin, getAdminNews);
router.post("/", verifyJWT, requireContentAdmin, createNews);
router.put("/:id", verifyJWT, requireContentAdmin, updateNews);
router.delete("/:id", verifyJWT, requireContentAdmin, deleteNews);
router.patch("/:id/publish", verifyJWT, requireContentAdmin, togglePublish);

export default router;
