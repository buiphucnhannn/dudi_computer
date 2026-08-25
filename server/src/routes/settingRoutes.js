import { Router } from "express";
import {
  getSettings,
  updateSettings,
  createBackup,
  clearCache,
} from "../controllers/settingController.js";
import { verifyJWT, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Public / Client read
router.get("/", getSettings);

// Admin restricted updates
router.put("/", verifyJWT, requireAdmin, updateSettings);
router.post("/backup", verifyJWT, requireAdmin, createBackup);
router.post("/clear-cache", verifyJWT, requireAdmin, clearCache);

export default router;
