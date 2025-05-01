import express from "express";
import * as messageController from "../controllers/message.controller";
import authMiddleware from "../middleware/auth.middleware";
import wrap from "./wrap";

const router = express.Router();

// Get all messages of a conversation
router.get(
  "/:conversationId",
  authMiddleware,
  wrap(messageController.getMessages)
);

// Create a new message
router.post("/", authMiddleware, wrap(messageController.createMessage));

// Update a message
router.put(
  "/:messageId",
  authMiddleware,
  wrap(messageController.updateMessage)
);

// Delete a message
router.delete(
  "/:messageId",
  authMiddleware,
  wrap(messageController.deleteMessage)
);

export default router;
