import express from "express";
import {
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  getTimelinePost,
  getUserPosts,
} from "../controllers/post.controller";
import authMiddleware from "../middleware/auth.middleware";
import wrap from "./wrap";

const router = express.Router();

// Create post
router.post("/", authMiddleware, wrap(createPost));

// Get post by id
router.get("/:id", wrap(getPost));

// Update post
router.put("/:id", authMiddleware, wrap(updatePost));

// Delete post
router.delete("/:id", authMiddleware, wrap(deletePost));

// Like post
router.put("/:id/like", authMiddleware, wrap(likePost));

// Get timeline posts
router.get("/:id/timeline", wrap(getTimelinePost));

// Get user posts
router.get("/user/:id", wrap(getUserPosts));

export default router;
