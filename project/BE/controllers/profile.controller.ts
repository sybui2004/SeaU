import User from "../models/user.model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { responseUtils } from "../utils/response.utils";
import jwt from "jsonwebtoken";

export const profileController = {
  // get a User
  getUser: async (req: Request, res: Response) => {
    const id = req.params.id;
    const { isAdmin } = req.body;

    try {
      const user = await User.findById(id).lean();
      if (!user) {
        res.status(404).json("No such user exists");
        return;
      }

      if (user.isDeleted && !isAdmin) {
        res.status(410).json("This user account has been deactivated");
        return;
      }

      const { password, ...otherDetails } = user;
      if (isAdmin) {
        responseUtils.success(res, user);
      } else {
        responseUtils.success(res, otherDetails);
      }
    } catch (error) {
      responseUtils.error(res, "Get user failed. Please try again.");
    }
  },

  // update a user
  updateUser: async (req: Request, res: Response) => {
    const id = req.params.id;
    const { _id, isAdmin, password } = req.body;
    if (id === _id || isAdmin) {
      try {
        if (password) {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(password, salt);
        }
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        const token = jwt.sign(
          { username: user?.username, id: user?._id },
          process.env.JWT_KEY || "",
          {
            expiresIn: "1h",
          }
        );
        responseUtils.success(res, { user, token });
      } catch (error) {
        responseUtils.error(res, "Update user failed. Please try again.");
      }
    } else {
      res
        .status(403)
        .json("Access Denied! You can only update your own profile");
    }
  },

  // delete user
  deleteUser: async (req: Request, res: Response) => {
    const id = req.params.id;
    const { currentUserId, isAdmin } = req.body;
    if (id === currentUserId || isAdmin) {
      try {
        const user = await User.findById(id);
        if (!user) {
          return responseUtils.error(res, "User not found", 404);
        }

        const originalUserInfo = {
          _id: user._id,
          username: user.username,
          fullname: user.fullname,
        };

        const anonymizedUser = await User.findByIdAndUpdate(
          id,
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

        responseUtils.success(res, "User has been soft deleted successfully");
      } catch (error) {
        responseUtils.error(res, "Delete user failed. Please try again.");
      }
    } else {
      res
        .status(403)
        .json("Access Denied! You can only delete your own profile");
    }
  },
};
