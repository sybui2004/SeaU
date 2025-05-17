import express from "express";
import {
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage,
  getAllMessagesForAdmin,
  updateMessageAsAdmin,
  deleteMessageAsAdmin,
  getMessagesByUserId,
} from "../controllers/message.controller";
import authMiddleware from "../middleware/auth.middleware";
import adminMiddleware from "../middleware/admin.middleware";
import wrap from "./wrap";

const router = express.Router();

// User routes
router.get("/user/:userId", authMiddleware, wrap(getMessagesByUserId));
router.get("/:conversationId", wrap(getMessages));

// Admin routes
router.get(
  "/admin/:conversationId",
  adminMiddleware,
  wrap(getAllMessagesForAdmin)
);

router.use(authMiddleware);

router.post("/", wrap(createMessage));
router.put("/:messageId", wrap(updateMessage));
router.delete("/:messageId", wrap(deleteMessage));
router.put("/admin/:messageId", adminMiddleware, wrap(updateMessageAsAdmin));
router.delete("/admin/:messageId", adminMiddleware, wrap(deleteMessageAsAdmin));

export default router;
