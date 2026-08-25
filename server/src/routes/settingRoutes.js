import { Router } from "express";
import {
  getSettings,
  updateSettings,
  createBackup,
  clearCache,
} from "../controllers/settingController.js";
import { verifyJWT, requireSuperAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Public / Client read
router.get("/", getSettings);

// Admin restricted updates (Chỉ Super Admin)
router.put("/", verifyJWT, requireSuperAdmin, updateSettings);
router.post("/backup", verifyJWT, requireSuperAdmin, createBackup);
router.post("/clear-cache", verifyJWT, requireSuperAdmin, clearCache);

export default router;
