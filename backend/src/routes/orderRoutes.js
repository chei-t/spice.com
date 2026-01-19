import express from "express";
import { createOrder, getOrders, getUserOrders } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js"; // Import the new middleware

const router = express.Router();

// User must be logged in to create an order
router.post("/", protect, createOrder);

//  Only admin or manager can get all orders
router.get("/", protect, authorizeRoles("admin"), getOrders);

// Logged-in user can view their orders
router.get("/myorders", protect, getUserOrders);

export default router;
