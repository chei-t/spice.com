import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All wishlist routes are protected
router.use(protect);

// Add product to wishlist
router.post("/", addToWishlist);

// Get user's wishlist
router.get("/", getWishlist);

// Remove product from wishlist
router.delete("/:productId", removeFromWishlist);

// Clear wishlist
router.delete("/", clearWishlist);

export default router;