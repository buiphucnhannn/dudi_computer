import { Router } from "express";
import {
  getAllProducts,
  getProductBySlug,
  getFlashSaleProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} from "../controllers/productController.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/flash-sale", getFlashSaleProducts);
router.get("/:slug", getProductBySlug);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/stock", updateStock);

export default router;
