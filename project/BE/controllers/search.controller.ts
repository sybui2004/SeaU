import { Request, Response } from "express";
import User from "../models/user.model";
import Post from "../models/post.model";
import { responseUtils } from "../utils/response.utils";

export const searchController = {
  search: async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      if (!query || query.length < 1) {
        return responseUtils.success(res, {
          users: [],
          posts: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        });
      }

      const totalUsers = await User.countDocuments({
        fullname: { $regex: query, $options: "i" },
      });

      const totalPosts = await Post.countDocuments({
        content: { $regex: query, $options: "i" },
      });

      const totalUserPages = Math.ceil(totalUsers / limit);
      const totalPostPages = Math.ceil(totalPosts / limit);
      const totalPages = Math.max(totalUserPages, totalPostPages);

      const users = await User.find({
        fullname: { $regex: query, $options: "i" },
      })
        .select("_id fullname profilePic occupation")
        .skip(skip)
        .limit(limit);

      const posts = await Post.find({
        content: { $regex: query, $options: "i" },
      })
        .skip(skip)
        .limit(limit);

      const postResults = await Promise.all(
        posts.map(async (post) => {
          const userData = await User.findById(post.userId).select(
            "_id fullname profilePic"
          );
          return {
            ...post.toObject(),
            userData,
          };
        })
      );

      return responseUtils.success(res, {
        users,
        posts: postResults,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: {
            users: totalUsers,
            posts: totalPosts,
          },
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      console.error("Search error:", error);
      return responseUtils.error(res, "Lỗi khi tìm kiếm", 500);
    }
  },

  searchUsers: async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      if (!query || query.length < 1) {
        return responseUtils.success(res, {
          users: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        });
      }

      const totalUsers = await User.countDocuments({
        fullname: { $regex: query, $options: "i" },
      });

      const totalPages = Math.ceil(totalUsers / limit);

      const users = await User.find({
        fullname: { $regex: query, $options: "i" },
      })
        .select("_id fullname profilePic occupation")
        .skip(skip)
        .limit(limit);

      return responseUtils.success(res, {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalUsers,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      console.error("Search users error:", error);
      return responseUtils.error(res, "Lỗi khi tìm kiếm người dùng", 500);
    }
  },
};
