import express from "express";
import {
  getAllNewsCategories,
  getAdminNewsCategories,
  getNewsCategoryById,
  createNewsCategory,
  updateNewsCategory,
  deleteNewsCategory,
} from "../controllers/newsCategoryController.js";
import { verifyJWT, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllNewsCategories);
router.get("/:id", getNewsCategoryById);

// Admin routes
router.get("/admin/all", verifyJWT, requireAdmin, getAdminNewsCategories);
router.post("/", verifyJWT, requireAdmin, createNewsCategory);
router.put("/:id", verifyJWT, requireAdmin, updateNewsCategory);
router.delete("/:id", verifyJWT, requireAdmin, deleteNewsCategory);

export default router;
