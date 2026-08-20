import { Router } from "express";
import {
  getWishlist,
  syncWishlist,
  addItem,
  updateQuantity,
  removeItem,
  clearWishlist,
} from "../controllers/wishlistController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

// Tất cả các thao tác Wishlist đồng bộ đám mây đều yêu cầu xác thực JWT
router.use(verifyJWT);

router.get("/", getWishlist);
router.post("/sync", syncWishlist);
router.post("/item", addItem);
router.put("/item/:productId", updateQuantity);
router.delete("/item/:productId", removeItem);
router.delete("/", clearWishlist);

export default router;
