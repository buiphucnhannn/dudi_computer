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
import { verifyJWT, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/flash-sale", getFlashSalePromotion);
router.get("/", getActivePromotions);

// Admin
router.get("/admin/all", verifyJWT, requireAdmin, getAdminPromotions);
router.get("/:id", verifyJWT, requireAdmin, getPromotionById);
router.post("/", verifyJWT, requireAdmin, createPromotion);
router.put("/:id", verifyJWT, requireAdmin, updatePromotion);
router.patch("/:id/toggle", verifyJWT, requireAdmin, togglePromotion);
router.delete("/:id", verifyJWT, requireAdmin, deletePromotion);

export default router;
