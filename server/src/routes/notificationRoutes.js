import { Router } from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import { verifyOptionalJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", verifyOptionalJWT, getNotifications);
router.get("/unread-count", verifyOptionalJWT, getUnreadCount);
router.patch("/read-all", verifyOptionalJWT, markAllAsRead);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
