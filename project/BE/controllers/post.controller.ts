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

// Get all posts of a user
export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments({ userId: userId });

    const userPosts = await Post.find({ userId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalPosts / limit);

    return responseUtils.success(res, {
      posts: userPosts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error retrieving user posts:", error);
    return responseUtils.error(res, "Error retrieving user posts", 500);
  }
};

// Get Timeline Post
export const getTimelinePost = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

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

    const allPosts = [
      ...currentUserPosts,
      ...(friendPost[0]?.friendPost || []),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);

    const paginatedPosts = allPosts.slice(skip, skip + limit);

    return responseUtils.success(res, {
      posts: paginatedPosts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error retrieving timeline posts:", error);
    return responseUtils.error(res, "Error retrieving timeline posts", 500);
  }
};
