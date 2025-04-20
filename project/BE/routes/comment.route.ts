import express from "express";
import type { Request, Response, NextFunction } from "express";
import * as commentController from "../controllers/comment.controller";

const router = express.Router();

// Get all comments of a post
router.get("/:postId", (req: Request, res: Response, next: NextFunction) => {
  commentController.getCommentsByPostId(req, res).catch(next);
});

// Create new comment
router.post("/", (req: Request, res: Response, next: NextFunction) => {
  commentController.createComment(req, res).catch(next);
});

// Update comment
router.put("/:commentId", (req: Request, res: Response, next: NextFunction) => {
  commentController.updateComment(req, res).catch(next);
});

// Delete comment
router.delete(
  "/:commentId",
  (req: Request, res: Response, next: NextFunction) => {
    commentController.deleteComment(req, res).catch(next);
  }
);

// Like/unlike comment
router.put(
  "/:commentId/like",
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
  (req: Request, res: Response, next: NextFunction) => {
    commentController.createReply(req, res).catch(next);
  }
);

export default router;
