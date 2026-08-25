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
import { uploadProductImages } from "../middlewares/uploadMiddleware.js";
import { verifyJWT, requireSalesAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/flash-sale", getFlashSaleProducts);
router.get("/:slug", getProductBySlug);
router.post("/", verifyJWT, requireSalesAdmin, uploadProductImages.array("images", 10), createProduct);
router.put("/:id", verifyJWT, requireSalesAdmin, uploadProductImages.array("images", 10), updateProduct);
router.delete("/:id", verifyJWT, requireSalesAdmin, deleteProduct);
router.patch("/:id/stock", verifyJWT, requireSalesAdmin, updateStock);

export default router;
