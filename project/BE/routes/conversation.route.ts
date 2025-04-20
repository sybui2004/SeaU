import express from "express";
import type { Request, Response, NextFunction } from "express";
import * as conversationController from "../controllers/conversation.controller";

const router = express.Router();

// Get all conversations of a user
router.get("/:userId", (req: Request, res: Response, next: NextFunction) => {
  conversationController.getConversations(req, res).catch(next);
});

// Create a new conversation
router.post("/", (req: Request, res: Response, next: NextFunction) => {
  conversationController.createConversation(req, res).catch(next);
});

// Create a new group chat
router.post("/group", (req: Request, res: Response, next: NextFunction) => {
  conversationController.createGroupChat(req, res).catch(next);
});

// Delete a conversation
router.delete(
  "/:conversationId",
  (req: Request, res: Response, next: NextFunction) => {
    conversationController.deleteConversation(req, res).catch(next);
  }
);

// Add a user to a group chat
router.put("/group/add", (req: Request, res: Response, next: NextFunction) => {
  conversationController.addToGroup(req, res).catch(next);
});

// Remove a user from a group chat
router.put(
  "/group/remove",
  (req: Request, res: Response, next: NextFunction) => {
    conversationController.removeFromGroup(req, res).catch(next);
  }
);

// Update a conversation
router.put(
  "/:conversationId",
  (req: Request, res: Response, next: NextFunction) => {
    conversationController.updateConversation(req, res).catch(next);
  }
);

export default router;
