import { Router } from "express";
import { couponController } from "../controllers/couponController.js";
import { verifyJWT, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Public: Áp dụng / kiểm tra mã giảm giá khi thanh toán
router.post("/validate", couponController.validateCoupon);

// Admin: Quản lý danh sách & CRUD khuyến mãi
router.get("/", verifyJWT, requireAdmin, couponController.getCoupons);
router.get("/:id", verifyJWT, requireAdmin, couponController.getCouponById);
router.post("/", verifyJWT, requireAdmin, couponController.createCoupon);
router.put("/:id", verifyJWT, requireAdmin, couponController.updateCoupon);
router.delete("/:id", verifyJWT, requireAdmin, couponController.deleteCoupon);

export default router;
