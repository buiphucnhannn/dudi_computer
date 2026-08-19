import { Router } from "express";
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyJWT, getProfile);

export default router;
