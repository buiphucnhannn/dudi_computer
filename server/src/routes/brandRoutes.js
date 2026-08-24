import { Router } from "express";
import {
  getAllBrands,
  getAdminBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";
import { verifyJWT, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", getAllBrands);
router.get("/:id", getBrandById);

// Admin routes
router.get("/admin/all", verifyJWT, requireAdmin, getAdminBrands);
router.post("/", verifyJWT, requireAdmin, createBrand);
router.put("/:id", verifyJWT, requireAdmin, updateBrand);
router.delete("/:id", verifyJWT, requireAdmin, deleteBrand);

export default router;
