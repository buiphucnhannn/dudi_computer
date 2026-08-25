import express from "express";
import {
  getFlashSalePromotion,
  getActivePromotions,
  getAdminPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  togglePromotion,
  deletePromotion,
} from "../controllers/promotionController.js";
import { verifyJWT, requireSalesAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/flash-sale", getFlashSalePromotion);
router.get("/", getActivePromotions);

// Admin
router.get("/admin/all", verifyJWT, requireSalesAdmin, getAdminPromotions);
router.get("/:id", verifyJWT, requireSalesAdmin, getPromotionById);
router.post("/", verifyJWT, requireSalesAdmin, createPromotion);
router.put("/:id", verifyJWT, requireSalesAdmin, updatePromotion);
router.patch("/:id/toggle", verifyJWT, requireSalesAdmin, togglePromotion);
router.delete("/:id", verifyJWT, requireSalesAdmin, deletePromotion);

export default router;
