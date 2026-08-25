import { Router } from "express";
import {
  getBanners,
  getBannersByPosition,
  getBannerById,
  createBanner,
  updateBanner,
  toggleBannerStatus,
  deleteBanner,
} from "../controllers/bannerController.js";

const router = Router();

// Public routes for client to fetch banners
router.get("/position/:position", getBannersByPosition);
router.get("/:id", getBannerById);
router.get("/", getBanners);

// Admin management routes
router.post("/", createBanner);
router.put("/:id", updateBanner);
router.patch("/:id/status", toggleBannerStatus);
router.delete("/:id", deleteBanner);

export default router;
