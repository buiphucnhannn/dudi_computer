import { Router } from "express";
import authRoutes from "./authRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import productRoutes from "./productRoutes.js";
import orderRoutes from "./orderRoutes.js";
import feedbackRoutes from "./feedbackRoutes.js";
import cartRoutes from "./cartRoutes.js";
import wishlistRoutes from "./cartRoutes.js";
import newsRoutes from "./newsRoutes.js";
import contactRoutes from "./contactRoutes.js";
import jobRoutes from "./jobRoutes.js";
import userRoutes from "./userRoutes.js";
import promotionRoutes from "./promotionRoutes.js";
import brandRoutes from "./brandRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import newsCategoryRoutes from "./newsCategoryRoutes.js";
import statisticRoutes from "./statisticRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import settingRoutes from "./settingRoutes.js";
import bannerRoutes from "./bannerRoutes.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { sessionManager } from "../utils/sessionManager.js";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json(
    new ApiResponse(200, { status: "OK", timestamp: new Date().toISOString() }, "Server ZComputer API is running")
  );
});

// Real-time Event Stream (SSE) cho cả khách vãng lai và người dùng
router.get("/system/events", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.write(`data: ${JSON.stringify({ type: "CONNECTED", timestamp: Date.now() })}\n\n`);
  sessionManager.addPublicSession(res);
});

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/brands", brandRoutes);
router.use("/orders", orderRoutes);
router.use("/feedbacks", feedbackRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/news", newsRoutes);
router.use("/news-categories", newsCategoryRoutes);
router.use("/contacts", contactRoutes);
router.use("/jobs", jobRoutes);
router.use("/users", userRoutes);
router.use("/promotions", promotionRoutes);
router.use("/upload", uploadRoutes);
router.use("/statistics", statisticRoutes);
router.use("/notifications", notificationRoutes);
router.use("/settings", settingRoutes);
router.use("/banners", bannerRoutes);

export default router;
