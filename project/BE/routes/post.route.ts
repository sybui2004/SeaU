import express, { NextFunction, Request, Response } from "express";
import {
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  getTimelinePost,
  getUserPosts,
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
router.get(
  "/:id/timeline",
  (req: Request, res: Response, next: NextFunction) => {
    getTimelinePost(req, res).catch(next);
  }
);

// Get user posts
router.get("/user/:id", (req: Request, res: Response, next: NextFunction) => {
  getUserPosts(req, res).catch(next);
});

export default router;
