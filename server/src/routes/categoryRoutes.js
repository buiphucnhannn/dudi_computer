import { Router } from "express";
import { getAllCategories, createCategory } from "../controllers/categoryController.js";
import { verifyJWT, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getAllCategories);
router.post("/", verifyJWT, requireAdmin, createCategory);

export default router;
