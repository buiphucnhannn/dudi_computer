import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { verifyJWT, requireSalesAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", verifyJWT, requireSalesAdmin, createCategory);
router.put("/:id", verifyJWT, requireSalesAdmin, updateCategory);
router.delete("/:id", verifyJWT, requireSalesAdmin, deleteCategory);

export default router;
