import express from "express";
import { savePaymentSettings } from "../controllers/settingsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

// Save payment settings (Admin only)
router.post("/payment", protect, authorizeRoles("admin"), savePaymentSettings);

export default router;
