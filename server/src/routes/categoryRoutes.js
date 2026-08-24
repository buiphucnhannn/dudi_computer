import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { verifyJWT, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", verifyJWT, requireAdmin, createCategory);
router.put("/:id", verifyJWT, requireAdmin, updateCategory);
router.delete("/:id", verifyJWT, requireAdmin, deleteCategory);

export default router;
