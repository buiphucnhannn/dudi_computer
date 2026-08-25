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
import {
  verifyJWT,
  verifyOptionalJWT,
  preventAdminShopping,
  requireSalesAdmin,
} from "../middlewares/authMiddleware.js";

const router = Router();

// Routes cho khách hàng / tra cứu
router.get("/my-orders", verifyJWT, getMyOrders);
router.get("/track/:codeOrId", trackOrder);

// Routes chung & Admin
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", verifyJWT, preventAdminShopping, createOrder);
router.patch("/:id/status", verifyJWT, requireSalesAdmin, updateOrderStatus);
router.put("/:id/status", verifyJWT, requireSalesAdmin, updateOrderStatus);
router.delete("/:id", verifyJWT, requireSalesAdmin, deleteOrder);

export default router;
