import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All cart routes are protected
router.use(protect);

// Add item to cart
router.post("/", addToCart);

// Get user's cart
router.get("/", getCart);

// Update cart item
router.put("/", updateCartItem);

// Remove item from cart
router.delete("/:productId", removeFromCart);

// Clear cart
router.delete("/", clearCart);

export default router;