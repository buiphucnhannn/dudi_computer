import { Router } from "express";
import {
  getAllOrders,
  getMyOrders,
  trackOrder,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { verifyOptionalJWT } from "../middlewares/authMiddleware.js";

const router = Router();

// Routes cho khách hàng / tra cứu
router.get("/my-orders", verifyOptionalJWT, getMyOrders);
router.get("/track/:codeOrId", trackOrder);

// Routes chung & Admin
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", verifyOptionalJWT, createOrder);
router.patch("/:id/status", updateOrderStatus);
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;
