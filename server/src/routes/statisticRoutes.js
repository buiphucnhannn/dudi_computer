import { Router } from "express";
import {
  getDashboardSummary,
  getRevenueChart,
  getSalesRatio,
  getTopProducts,
} from "../controllers/statisticController.js";

const router = Router();

router.get("/summary", getDashboardSummary);
router.get("/revenue-chart", getRevenueChart);
router.get("/sales-ratio", getSalesRatio);
router.get("/top-products", getTopProducts);

export default router;
