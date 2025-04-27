import express from "express";
import type { Request, Response, NextFunction } from "express";
import * as conversationController from "../controllers/conversation.controller";
import authMiddleWare from "../middleware/auth.middleware";

const router = express.Router();

// Get all conversations of a user
router.get(
  "/:userId",
  authMiddleWare,
  (req: Request, res: Response, next: NextFunction) => {
    conversationController.getConversations(req, res).catch(next);
  }
);
// Get conversation by Id
router.get(
  "/get/:conversationId",
  authMiddleWare,
  (req: Request, res: Response, next: NextFunction) => {
    conversationController.getConversation(req, res).catch(next);
  }
);

// Get a conversation between two users
router.get(
  "/find/:firstUserId/:secondUserId",
  (req: Request, res: Response, next: NextFunction) => {
    conversationController.findConversation(req, res).catch(next);
  }
);

// Create a new conversation
router.post(
  "/",
  authMiddleWare,
  (req: Request, res: Response, next: NextFunction) => {
    conversationController.createConversation(req, res).catch(next);
  }
);

// Create a new group chat
router.post(
  "/group",
  authMiddleWare,
  (req: Request, res: Response, next: NextFunction) => {
    conversationController.createGroupChat(req, res).catch(next);
  }
);

// Delete a conversation
router.delete(
  "/:conversationId",
  authMiddleWare,
  (req: Request, res: Response, next: NextFunction) => {
    conversationController.deleteConversation(req, res).catch(next);
  }
);

// Add a user to a group chat
router.put(
  "/group/add",
  authMiddleWare,
  (req: Request, res: Response, next: NextFunction) => {
    conversationController.addToGroup(req, res).catch(next);
  }
);

// Remove a user from a group chat
router.put(
  "/group/remove",
  authMiddleWare,
  (req: Request, res: Response, next: NextFunction) => {
    conversationController.removeFromGroup(req, res).catch(next);
  }
);

// Update a conversation
router.put(
  "/:conversationId",
  authMiddleWare,
  (req: Request, res: Response, next: NextFunction) => {
    conversationController.updateConversation(req, res).catch(next);
  }
);

export default router;
