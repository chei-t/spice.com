import express from "express";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// GET all products
router.get("/", getProducts);

// POST a new product (Admin only)
router.post("/", protect, authorizeRoles("admin"), upload.single('image'), addProduct);

// PUT update product (Admin only)
router.put("/:id", protect, authorizeRoles("admin"), upload.single('image'), updateProduct);

// DELETE product (Admin only)
router.delete("/:id", protect, authorizeRoles("admin"), deleteProduct);

export default router;
