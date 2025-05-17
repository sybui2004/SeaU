import express from "express";
import * as commentController from "../controllers/comment.controller";
import authMiddleware from "../middleware/auth.middleware";
import wrap from "./wrap";

const router = express.Router();

// Admin route to get all comments by a user
router.get(
  "/admin/user/:userId",
  wrap(commentController.getAllCommentsByUserForAdmin)
);

// Get all comments of a post
router.get("/post/:postId", wrap(commentController.getCommentsByPostId));

// Get a comment by id
router.get("/get/:commentId", wrap(commentController.getCommentById));

// Get all replies of a comment
router.get(
  "/:commentId/replies",
  wrap(commentController.getRepliesByCommentId)
);

router.use(authMiddleware);
// Create new comment
router.post("/", wrap(commentController.createComment));

// Update comment
router.put("/:commentId", wrap(commentController.updateComment));

// Delete comment
router.delete("/:commentId", wrap(commentController.deleteComment));

// Like/unlike comment
router.put("/:commentId/like", wrap(commentController.likeComment));

// Create reply for comment
router.post("/:commentId/reply", wrap(commentController.createReply));

export default router;
