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

const router = Router();

router.get("/", getAllProducts);
router.get("/flash-sale", getFlashSaleProducts);
router.get("/:slug", getProductBySlug);
router.post("/", uploadProductImages.array("images", 10), createProduct);
router.put("/:id", uploadProductImages.array("images", 10), updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/stock", updateStock);

export default router;
