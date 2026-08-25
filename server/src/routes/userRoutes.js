import { Router } from "express";
import { userController } from "../controllers/userController.js";
import {
  verifyJWT,
  requireCustomerAdmin,
  requireSuperAdmin,
} from "../middlewares/authMiddleware.js";

const router = Router();

// Tất cả các routes quản lý khách hàng đều bắt buộc là Admin (Admin Quản Lý Khách Hàng hoặc Admin Toàn Quyền)
router.use(verifyJWT, requireCustomerAdmin);

router.get("/stats", userController.getCustomerStats);
router.get("/", userController.getCustomers);
router.get("/:id", userController.getCustomerById);
router.patch("/:id/status", userController.updateCustomerStatus);

// Chỉ Super Admin mới có quyền phân quyền vai trò Admin cho tài khoản
router.patch("/:id/role", requireSuperAdmin, userController.updateUserRole);
router.delete("/:id", requireSuperAdmin, userController.deleteCustomer);

export default router;
