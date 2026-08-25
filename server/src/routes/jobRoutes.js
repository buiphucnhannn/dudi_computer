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
import { verifyJWT, requireContentAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", getAllJobs);
router.get("/detail/:id", getJobById);
router.get("/:slug", getJobBySlug);

// Admin routes
router.get("/admin/all", verifyJWT, requireContentAdmin, getAdminJobs);
router.post("/", verifyJWT, requireContentAdmin, createJob);
router.put("/:id", verifyJWT, requireContentAdmin, updateJob);
router.delete("/:id", verifyJWT, requireContentAdmin, deleteJob);
router.patch("/:id/toggle-status", verifyJWT, requireContentAdmin, toggleJobStatus);
router.patch("/:id/toggle", verifyJWT, requireContentAdmin, toggleJobStatus);

export default router;
