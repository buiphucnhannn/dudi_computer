import { Router } from "express";
import {
  getCart,
  syncCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

// Tất cả các thao tác Giỏ hàng đồng bộ đám mây đều yêu cầu xác thực JWT
router.use(verifyJWT);

router.get("/", getCart);
router.post("/sync", syncCart);
router.post("/items", addItemToCart);
router.put("/items/:id", updateCartItemQuantity);
router.delete("/items/:id", removeCartItem);
router.delete("/clear", clearCart);

export default router;
