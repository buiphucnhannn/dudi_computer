import { Router } from "express";
import { userController } from "../controllers/userController.js";
import { verifyJWT, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Tất cả các routes quản lý khách hàng đều bắt buộc là Admin
router.use(verifyJWT, requireAdmin);

router.get("/stats", userController.getCustomerStats);
router.get("/", userController.getCustomers);
router.get("/:id", userController.getCustomerById);
router.patch("/:id/status", userController.updateCustomerStatus);
router.delete("/:id", userController.deleteCustomer);

export default router;
