import { Router } from "express";
import { createFeedback, getFeedbacks } from "../controllers/feedbackController.js";

const router = Router();

// Public endpoint để khách hàng gửi phản hồi
router.post("/", createFeedback);

// Endpoint xem danh sách phản hồi (cho Admin)
router.get("/", getFeedbacks);

export default router;
