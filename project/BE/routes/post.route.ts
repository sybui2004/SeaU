import express from "express";
import {
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  getTimelinePost,
} from "../controllers/post.controller";
const router = express.Router();

// Create a new post
router.post("/", createPost);

// Get a post by id
router.get("/:id", getPost);

// Update a post
router.put("/:id", updatePost);

// Delete a post
router.delete("/:id", deletePost);

// Like a post
router.put("/:id/like", likePost);

// Get timeline posts
router.get("/:id/timeline", getTimelinePost);

export default router;
