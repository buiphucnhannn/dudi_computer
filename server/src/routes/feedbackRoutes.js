import { Router } from "express";
import { createFeedback, getFeedbacks } from "../controllers/feedbackController.js";
import { feedbackLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// Public endpoint để khách hàng gửi phản hồi
router.post("/", feedbackLimiter, createFeedback);

// Endpoint xem danh sách phản hồi (cho Admin)
router.get("/", getFeedbacks);

export default router;
