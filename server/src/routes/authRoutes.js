import { Router } from "express";
import {
  registerUser,
  verifyRegistrationOtp,
  resendVerificationOtp,
  loginUser,
  googleAuth,
  refreshAccessToken,
  logoutUser,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  getSessionStream,
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
router.post("/verify-registration-otp", resetPasswordLimiter, verifyRegistrationOtp);
router.post("/resend-verification-otp", forgotPasswordLimiter, resendVerificationOtp);
router.post("/login", authLoginLimiter, loginUser);
router.post("/google", authLoginLimiter, googleAuth);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPasswordLimiter, resetPassword);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", verifyJWT, logoutUser);
router.get("/profile", verifyJWT, getProfile);
router.put("/profile", verifyJWT, updateProfile);
router.get("/session-stream", verifyJWT, getSessionStream);

export default router;
