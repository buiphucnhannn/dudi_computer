import { Router } from "express";
import {
  getDashboardSummary,
  getRevenueChart,
  getSalesRatio,
  getTopProducts,
} from "../controllers/statisticController.js";
import { verifyJWT, requireSalesAdmin, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Dashboard summary được xem bởi tất cả Admin roles
router.get("/summary", verifyJWT, requireAdmin, getDashboardSummary);

// Báo cáo doanh thu chuyên sâu yêu cầu Sales Admin hoặc Super Admin
router.get("/revenue-chart", verifyJWT, requireSalesAdmin, getRevenueChart);
router.get("/sales-ratio", verifyJWT, requireSalesAdmin, getSalesRatio);
router.get("/top-products", verifyJWT, requireSalesAdmin, getTopProducts);

export default router;
