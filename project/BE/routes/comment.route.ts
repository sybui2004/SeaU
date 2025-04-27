import express from "express";
import type { Request, Response, NextFunction } from "express";
import * as commentController from "../controllers/comment.controller";
import authMiddleWare from "../middleware/auth.middleware";

const router = express.Router();

// Get all comments of a post
router.get("/:postId", (req: Request, res: Response, next: NextFunction) => {
  commentController.getCommentsByPostId(req, res).catch(next);
});

// Get a comment by id
router.get(
  "/get/:commentId",
  (req: Request, res: Response, next: NextFunction) => {
    commentController.getCommentById(req, res).catch(next);
  }
);

// Create new comment
router.post(
  "/",
  authMiddleWare,
  (req: Request, res: Response, next: NextFunction) => {
    commentController.createComment(req, res).catch(next);
  }
);

// Update comment
router.put(
  "/:commentId",
  authMiddleWare,
  (req: Request, res: Response, next: NextFunction) => {
    commentController.updateComment(req, res).catch(next);
  }
);

// Delete comment
router.delete(
  "/:commentId",
  authMiddleWare,
  (req: Request, res: Response, next: NextFunction) => {
    commentController.deleteComment(req, res).catch(next);
  }
);

// Like/unlike comment
router.put(
  "/:commentId/like",
  authMiddleWare,
  (req: Request, res: Response, next: NextFunction) => {
    commentController.likeComment(req, res).catch(next);
  }
);

// Get all replies of a comment
router.get(
  "/:commentId/replies",
  (req: Request, res: Response, next: NextFunction) => {
    commentController.getRepliesByCommentId(req, res).catch(next);
  }
);

// Create reply for comment
router.post(
  "/:commentId/reply",
  authMiddleWare,
  (req: Request, res: Response, next: NextFunction) => {
    commentController.createReply(req, res).catch(next);
  }
);

export default router;
