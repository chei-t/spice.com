import express from "express";
import {
  getMessages,
  markAsRead,
  sendReply,
  deleteMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

router.route("/").get(protect, authorizeRoles("admin"), getMessages);
router.route("/:id/read").patch(protect, authorizeRoles("admin"), markAsRead);
router.route("/:id/reply").post(protect, authorizeRoles("admin"), sendReply);
router.route("/:id").delete(protect, authorizeRoles("admin"), deleteMessage);

export default router;
