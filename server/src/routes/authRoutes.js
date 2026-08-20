import { Router } from "express";
import {
  registerUser,
  loginUser,
  googleAuth,
  refreshAccessToken,
  logoutUser,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import {
  authLoginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
} from "../middlewares/rateLimiter.js";

const router = Router();

router.post("/register", registerLimiter, registerUser);
router.post("/login", authLoginLimiter, loginUser);
router.post("/google", authLoginLimiter, googleAuth);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPasswordLimiter, resetPassword);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", verifyJWT, logoutUser);
router.get("/profile", verifyJWT, getProfile);
router.put("/profile", verifyJWT, updateProfile);

export default router;
