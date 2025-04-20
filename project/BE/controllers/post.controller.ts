import Post from "../models/post.model";
import User from "../models/user.model";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { responseUtils } from "../utils/response.utils";

// Create new Post
export const createPost = async (req: Request, res: Response) => {
  const newPost = new Post(req.body);

  try {
    await newPost.save();
    responseUtils.success(res, newPost);
  } catch (error) {
    responseUtils.error;
  }
};

// Get a Post
export const getPost = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const post = await Post.findById(id);
    responseUtils.success(res, post);
  } catch (error) {
    responseUtils.error;
  }
};

// Update a Post
export const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const { userId, currentUserAdminStatus } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json("Post not found");
      return;
    }
    if (post.userId == userId || currentUserAdminStatus) {
      await post.updateOne({ $set: req.body });
      responseUtils.success(res, "Post Updated");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    responseUtils.error;
  }
};

// Delete a Post
export const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const { userId, currentUserAdminStatus } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json("Post not found");
      return;
    }
    if (post.userId == userId || currentUserAdminStatus) {
      await post.deleteOne();
      responseUtils.success(res, "Post deleted");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    responseUtils.error;
  }
};

// React a Post
export const likePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { userId, currentUserAdminStatus } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json("Post not found");
      return;
    }
    if (!post.likes.includes(userId) || currentUserAdminStatus) {
      await post.updateOne({ $push: { likes: userId } });
      responseUtils.success(res, "Post liked");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      responseUtils.success(res, "Post unliked");
    }
  } catch (error) {
    responseUtils.error(res, "Like post failed. Please try again.");
  }
};

// Get Timeline Post
export const getTimelinePost = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const currentUserPosts = await Post.find({ userId: userId });
    const friendPost = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $project: {
          friends: {
            $map: {
              input: "$friends",
              as: "friendId",
              in: { $toObjectId: "$$friendId" },
            },
          },
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "friends",
          foreignField: "userId",
          as: "friendPost",
        },
      },
      {
        $project: {
          friendPost: 1,
          _id: 0,
        },
      },
    ]);

    res
      .status(200)
      .json(
        [...currentUserPosts, ...(friendPost[0]?.friendPost || [])].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
  } catch (error) {
    responseUtils.error;
  }
};
