import express from "express";
import type { Request, Response, NextFunction } from "express";
import * as messageController from "../controllers/message.controller";

const router = express.Router();

// Get all messages of a conversation
router.get(
  "/:conversationId",
  (req: Request, res: Response, next: NextFunction) => {
    messageController.getMessages(req, res).catch(next);
  }
);

// Create a new message
router.post("/", (req: Request, res: Response, next: NextFunction) => {
  messageController.createMessage(req, res).catch(next);
});

// Update a message
router.put("/:messageId", (req: Request, res: Response, next: NextFunction) => {
  messageController.updateMessage(req, res).catch(next);
});

// Delete a message
router.delete(
  "/:messageId",
  (req: Request, res: Response, next: NextFunction) => {
    messageController.deleteMessage(req, res).catch(next);
  }
);

export default router;
