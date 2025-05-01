import Post from "../models/post.model";
import User from "../models/user.model";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { responseUtils } from "../utils/response.utils";

// Create new Post
export const createPost = async (req: Request, res: Response) => {
  console.log("createPost controller - request body:", req.body);

  // Kiểm tra userId từ middleware
  if (!req.body.userId) {
    console.log("No userId found in request body");
    return responseUtils.error(res, "Authentication required", 401);
  }

  try {
    if (req.body._id) {
      delete req.body._id;
    }

    // Đảm bảo userId được set từ middleware được giữ nguyên
    const newPost = new Post({
      ...req.body,
    });

    console.log("Saving new post:", newPost);
    await newPost.save();
    responseUtils.success(res, newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    responseUtils.error(res, "Error creating post", 500);
  }
};

// Get a Post
export const getPost = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const post = await Post.findById(id);
    if (!post) {
      responseUtils.error(res, "Post not found", 404);
      return;
    }
    responseUtils.success(res, post);
  } catch (error) {
    responseUtils.error(res, "Error fetching post", 500);
  }
};

// Update a Post
export const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    console.log("Update post: No userId found");
    return responseUtils.error(res, "Authentication required", 401);
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      responseUtils.error(res, "Post not found", 404);
      return;
    }

    if (post.userId.toString() !== userId) {
      responseUtils.error(res, "Action forbidden", 403);
      return;
    }

    if (req.body._id) delete req.body._id;
    // Không cần xóa isAuthenticated nữa

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: req.body },
      { new: true }
    );

    responseUtils.success(res, updatedPost);
  } catch (error) {
    responseUtils.error(res, "Error updating post", 500);
  }
};

// Delete a Post
export const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    console.log("Delete post: No userId found");
    return responseUtils.error(res, "Authentication required", 401);
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      responseUtils.error(res, "Post not found", 404);
      return;
    }

    // Chỉ cho phép chủ sở hữu bài viết xóa
    if (post.userId.toString() !== userId) {
      responseUtils.error(res, "Action forbidden", 403);
      return;
    }

    await post.deleteOne();
    responseUtils.success(res, "Post deleted successfully");
  } catch (error) {
    responseUtils.error(res, "Error deleting post", 500);
  }
};

// Like/Unlike a Post
export const likePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    console.log("Like post: No userId found");
    return responseUtils.error(res, "Authentication required", 401);
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      responseUtils.error(res, "Post not found", 404);
      return;
    }

    // Kiểm tra xem user đã like chưa để toggle
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike nếu đã like
      await post.updateOne({ $pull: { likes: userId } });
      responseUtils.success(res, "Post unliked");
    } else {
      // Like nếu chưa like
      await post.updateOne({ $push: { likes: userId } });
      responseUtils.success(res, "Post liked");
    }
  } catch (error) {
    responseUtils.error(res, "Like post failed. Please try again.", 500);
  }
};

// Get Timeline Posts (các bài viết của người dùng và bạn bè)
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
    responseUtils.error(res, "Error retrieving timeline posts", 500);
  }
};

// Get user's posts
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
