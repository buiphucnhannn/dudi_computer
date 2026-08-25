import express from "express";
import {
  getAllNewsCategories,
  getAdminNewsCategories,
  getNewsCategoryById,
  createNewsCategory,
  updateNewsCategory,
  deleteNewsCategory,
} from "../controllers/newsCategoryController.js";
import { verifyJWT, requireContentAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllNewsCategories);
router.get("/:id", getNewsCategoryById);

// Admin routes
router.get("/admin/all", verifyJWT, requireContentAdmin, getAdminNewsCategories);
router.post("/", verifyJWT, requireContentAdmin, createNewsCategory);
router.put("/:id", verifyJWT, requireContentAdmin, updateNewsCategory);
router.delete("/:id", verifyJWT, requireContentAdmin, deleteNewsCategory);

export default router;
