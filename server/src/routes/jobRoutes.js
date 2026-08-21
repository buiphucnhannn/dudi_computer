import { Router } from "express";
import {
  getAllJobs,
  getJobBySlug,
  createJob,
} from "../controllers/jobController.js";

const router = Router();

router.get("/", getAllJobs);
router.get("/:slug", getJobBySlug);
router.post("/", createJob);

export default router;
