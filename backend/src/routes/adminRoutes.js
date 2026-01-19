import express from "express";
import {
  getAllUsers,
  deleteUser,
  getAllProducts,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorizeRoles("admin"));

// User management
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Product management
router.get("/products", getAllProducts);
router.delete("/products/:id", deleteProduct);

// Order management
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

export default router;