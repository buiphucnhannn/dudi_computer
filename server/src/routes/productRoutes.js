import { Router } from "express";
import {
  getAllProducts,
  getProductBySlug,
  getFlashSaleProducts,
  createProduct,
} from "../controllers/productController.js";
import { verifyJWT, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/flash-sale", getFlashSaleProducts);
router.get("/:slug", getProductBySlug);
router.post("/", verifyJWT, requireAdmin, createProduct);

export default router;
