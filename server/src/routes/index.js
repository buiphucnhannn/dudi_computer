import { Router } from "express";
import authRoutes from "./authRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import productRoutes from "./productRoutes.js";
import orderRoutes from "./orderRoutes.js";
import feedbackRoutes from "./feedbackRoutes.js";
import { ApiResponse } from "../utils/apiResponse.js";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json(
    new ApiResponse(200, { status: "OK", timestamp: new Date().toISOString() }, "Server ZComputer API is running")
  );
});

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/feedbacks", feedbackRoutes);

export default router;
