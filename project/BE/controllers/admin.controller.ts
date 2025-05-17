import { Request, Response } from "express";
import User from "../models/user.model";
import Post from "../models/post.model";
import Comment from "../models/comment.model";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";
import { responseUtils } from "../utils/response.utils";

export const adminController = {
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const searchQuery = req.query.search as string;
      const skip = (page - 1) * limit;

      const filter: any = {
        isDeleted: { $ne: true },
      };

      if (searchQuery) {
        filter.$or = [
          { fullname: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
          { username: { $regex: searchQuery, $options: "i" } },
        ];
      }

      const totalUsers = await User.countDocuments(filter);
      const users = await User.find(filter, { password: 0 })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const usersWithStats = await Promise.all(
        users.map(async (user) => {
          const userId = user._id;

          const postsCount = await Post.countDocuments({ userId });

          const commentsCount = await Comment.countDocuments({ userId });

          const messagesCount = await Message.countDocuments({
            senderId: userId,
            isDeleted: false,
          });

          return {
            ...user.toObject(),
            postsCount,
            commentsCount,
            messagesCount,
          };
        })
      );

      const totalPages = Math.ceil(totalUsers / limit);

      responseUtils.success(res, {
        users: usersWithStats,
        pagination: {
          totalUsers,
          totalPages,
          currentPage: page,
          limit,
        },
      });
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      responseUtils.error(res, "Failed to get users list");
    }
  },

  getUserById: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return responseUtils.error(res, "User ID is required", 400);
      }

      const user = await User.findById(userId, { password: 0 });

      if (!user) {
        return responseUtils.error(res, "User not found", 404);
      }

      if (user.isDeleted) {
        return responseUtils.error(
          res,
          "This user account has been deactivated",
          410
        );
      }

      const postsCount = await Post.countDocuments({ userId });
      const commentsCount = await Comment.countDocuments({ userId });

      const messagesCount = await Message.countDocuments({
        senderId: userId,
        isDeleted: false,
      });
      const userData = {
        ...user.toObject(),
        postsCount,
        commentsCount,
        messagesCount,
      };

      responseUtils.success(res, { user: userData });
    } catch (error) {
      console.error("Error in getUserById:", error);
      responseUtils.error(res, "Failed to get user details");
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const updateData = req.body;

      if (!userId) {
        return responseUtils.error(res, "User ID is required", 400);
      }

      if (req.file) {
        const filename = req.file.filename;
        const profilePicPath = `/${filename}`;
        updateData.profilePic = profilePicPath;
      } else {
        console.log("No file uploaded in this request");
      }

      const { password, isAdmin, ...safeUpdateData } = updateData;

      const user = await User.findById(userId);

      if (!user) {
        return responseUtils.error(res, "User not found", 404);
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: safeUpdateData },
        { new: true, select: "-password" }
      );

      responseUtils.success(res, {
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error in updateUser:", error);
      responseUtils.error(res, "Failed to update user");
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const hardDelete = req.query.hard_delete === "true";

      if (!userId) {
        return responseUtils.error(res, "User ID is required", 400);
      }

      const user = await User.findById(userId);

      if (!user) {
        return responseUtils.error(res, "User not found", 404);
      }

      if (user.isAdmin) {
        return responseUtils.error(res, "Cannot delete admin account", 403);
      }

      if (hardDelete) {
        await Post.deleteMany({ userId });
        await Comment.deleteMany({ userId });
        await Message.deleteMany({ senderId: userId });

        const conversations = await Conversation.find({ members: userId });
        for (const conversation of conversations) {
          if (conversation.isGroupChat) {
            const originalAdmin = conversation.groupAdmin;
            const updatedMembers = conversation.members.filter(
              (memberId) => memberId.toString() !== userId.toString()
            );

            if (updatedMembers.length < 2) {
              await Conversation.findByIdAndDelete(conversation._id);
              await Message.deleteMany({ conversationId: conversation._id });
            } else {
              conversation.members = updatedMembers;
              if (
                originalAdmin &&
                originalAdmin.toString() === userId.toString()
              ) {
                conversation.groupAdmin = updatedMembers[0];
              }
              await conversation.save();
            }
          } else {
            await Conversation.findByIdAndDelete(conversation._id);
            await Message.deleteMany({ conversationId: conversation._id });
          }
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
          return responseUtils.error(
            res,
            "User not found or already deleted during process",
            404
          );
        }

        responseUtils.success(res, {
          message: "User and associated data permanently deleted",
          user: {
            _id: deletedUser._id,
            username: deletedUser.username,
            fullname: deletedUser.fullname,
          },
        });
      } else {
        const originalUserInfo = {
          _id: user._id,
          username: user.username,
          fullname: user.fullname,
        };

        const anonymizedUser = await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              fullname: "Người dùng SeaU",
              username: `deleted_user_${Date.now()}`,
              email: `deleted_${Date.now()}@deleted.sea`,
              bio: "",
              profilePic: "defaultProfile.png",
              isDeleted: true,
              deletedAt: new Date(),
            },
          },
          { new: true, select: "-password" }
        );

        if (!anonymizedUser) {
          return responseUtils.error(
            res,
            "Failed to anonymize user account",
            500
          );
        }

        responseUtils.success(res, {
          message: "User has been soft deleted successfully",
          originalUser: originalUserInfo,
          anonymizedUser: {
            _id: anonymizedUser._id,
            fullname: anonymizedUser.fullname,
          },
        });
      }
    } catch (error) {
      console.error("Error in deleteUser:", error);
      const hardDelete = req.query.hard_delete === "true";
      responseUtils.error(
        res,
        hardDelete
          ? "Failed to permanently delete user and associated data"
          : "Failed to soft delete user"
      );
    }
  },

  getDashboardStats: async (req: Request, res: Response) => {
    try {
      const totalUsers = await User.countDocuments({
        isDeleted: { $ne: true },
      });

      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const newUsers = await User.countDocuments({
        createdAt: { $gte: lastWeek },
        isDeleted: { $ne: true },
      });

      const totalPosts = await Post.countDocuments();

      responseUtils.success(res, {
        totalUsers,
        newUsers,
        totalPosts,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error("Error in getDashboardStats:", error);
      responseUtils.error(res, "Failed to get dashboard statistics");
    }
  },
};

export default adminController;
