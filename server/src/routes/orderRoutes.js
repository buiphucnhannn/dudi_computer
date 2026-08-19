import { Router } from "express";
import { createOrder, getMyOrders } from "../controllers/orderController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

// Khách có thể đặt hàng trực tiếp hoặc người dùng đã login
router.post("/", (req, res, next) => {
  // Optional auth check nếu có token
  if (req.header("Authorization") || req.cookies?.accessToken) {
    return verifyJWT(req, res, next);
  }
  next();
}, createOrder);

router.get("/my-orders", verifyJWT, getMyOrders);

export default router;
