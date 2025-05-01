import express from "express";
import * as commentController from "../controllers/comment.controller";
import authMiddleware from "../middleware/auth.middleware";
import wrap from "./wrap";

const router = express.Router();

// Get all comments of a post
router.get("/:postId", wrap(commentController.getCommentsByPostId));

// Get a comment by id
router.get("/get/:commentId", wrap(commentController.getCommentById));

// Get all replies of a comment
router.get(
  "/:commentId/replies",
  wrap(commentController.getRepliesByCommentId)
);

// Create new comment
router.post("/", authMiddleware, wrap(commentController.createComment));

// Update comment
router.put(
  "/:commentId",
  authMiddleware,
  wrap(commentController.updateComment)
);

// Delete comment
router.delete(
  "/:commentId",
  authMiddleware,
  wrap(commentController.deleteComment)
);

// Like/unlike comment
router.put(
  "/:commentId/like",
  authMiddleware,
  wrap(commentController.likeComment)
);

// Create reply for comment
router.post(
  "/:commentId/reply",
  authMiddleware,
  wrap(commentController.createReply)
);

export default router;
