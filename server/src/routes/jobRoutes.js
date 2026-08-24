import { Router } from "express";
import {
  getAllJobs,
  getAdminJobs,
  getJobBySlug,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  toggleJobStatus,
} from "../controllers/jobController.js";
import { verifyJWT, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", getAllJobs);
router.get("/detail/:id", getJobById);
router.get("/:slug", getJobBySlug);

// Admin routes
router.get("/admin/all", verifyJWT, requireAdmin, getAdminJobs);
router.post("/", verifyJWT, requireAdmin, createJob);
router.put("/:id", verifyJWT, requireAdmin, updateJob);
router.delete("/:id", verifyJWT, requireAdmin, deleteJob);
router.patch("/:id/toggle-status", verifyJWT, requireAdmin, toggleJobStatus);

export default router;
