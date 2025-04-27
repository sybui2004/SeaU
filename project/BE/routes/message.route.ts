import express from "express";
import type { Request, Response, NextFunction } from "express";
import * as messageController from "../controllers/message.controller";
import authMiddleWare from "../middleware/auth.middleware";

const router = express.Router();

// Get all messages of a conversation
router.get(
  "/:conversationId",
  authMiddleWare,
  (req: Request, res: Response, next: NextFunction) => {
    messageController.getMessages(req, res).catch(next);
  }
);

// Create a new message
router.post(
  "/",
  authMiddleWare,
  (req: Request, res: Response, next: NextFunction) => {
    messageController.createMessage(req, res).catch(next);
  }
);

// Update a message
router.put(
  "/:messageId",
  authMiddleWare,
  (req: Request, res: Response, next: NextFunction) => {
    messageController.updateMessage(req, res).catch(next);
  }
);

// Delete a message
router.delete(
  "/:messageId",
  authMiddleWare,
  (req: Request, res: Response, next: NextFunction) => {
    messageController.deleteMessage(req, res).catch(next);
  }
);

export default router;
