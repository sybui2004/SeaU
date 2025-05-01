import express from "express";
import * as conversationController from "../controllers/conversation.controller";
import authMiddleware from "../middleware/auth.middleware";
import wrap from "./wrap";

const router = express.Router();

// Get all conversations of a user
router.get(
  "/:userId",
  authMiddleware,
  wrap(conversationController.getConversations)
);

// Get conversation by Id
router.get(
  "/get/:conversationId",
  authMiddleware,
  wrap(conversationController.getConversation)
);

// Get a conversation between two users
router.get(
  "/find/:firstUserId/:secondUserId",
  wrap(conversationController.findConversation)
);

// Create a new conversation
router.post(
  "/",
  authMiddleware,
  wrap(conversationController.createConversation)
);

// Create a new group chat
router.post(
  "/group",
  authMiddleware,
  wrap(conversationController.createGroupChat)
);

// Delete a conversation
router.delete(
  "/:conversationId",
  authMiddleware,
  wrap(conversationController.deleteConversation)
);

// Add a user to a group chat
router.put(
  "/group/add",
  authMiddleware,
  wrap(conversationController.addToGroup)
);

// Remove a user from a group chat
router.put(
  "/group/remove",
  authMiddleware,
  wrap(conversationController.removeFromGroup)
);

// Update a conversation
router.put(
  "/:conversationId",
  authMiddleware,
  wrap(conversationController.updateConversation)
);

export default router;
