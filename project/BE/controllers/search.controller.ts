import { Request, Response } from "express";
import User from "../models/user.model";
import Post from "../models/post.model";

export const searchController = {
  search: async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;

      if (!query || query.length < 1) {
        return res.json({ users: [], posts: [] });
      }

      const users = await User.find({
        fullname: { $regex: query, $options: "i" },
      })
        .select("_id fullname profilePic occupation")
        .limit(5);

      const posts = await Post.find({
        content: { $regex: query, $options: "i" },
      }).limit(10);

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

      return res.json({ users, posts: postResults });
    } catch (error) {
      console.error("Search error:", error);
      return res.status(500).json({ error: "Lỗi khi tìm kiếm" });
    }
  },

  searchUsers: async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;

      if (!query || query.length < 1) {
        return res.json([]);
      }

      const users = await User.find({
        fullname: { $regex: query, $options: "i" },
      })
        .select("_id fullname profilePic occupation")
        .limit(10);

      return res.json(users);
    } catch (error) {
      console.error("Search users error:", error);
      return res.status(500).json({ error: "Lỗi khi tìm kiếm người dùng" });
    }
  },
};
