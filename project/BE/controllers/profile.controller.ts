import User from "../models/user.model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { responseUtils } from "../utils/response.utils";
import jwt from "jsonwebtoken";

export const profileController = {
  // get a User
  getUser: async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
      const user = await User.findById(id).lean();
      if (!user) {
        res.status(404).json("No such user exists");
        return;
      }
      const { password, ...otherDetails } = user;
      responseUtils.success(res, otherDetails);
    } catch (error) {
      responseUtils.error(res, "Get user failed. Please try again.");
    }
  },

  // update a user
  updateUser: async (req: Request, res: Response) => {
    const id = req.params.id;
    const { _id, currentUserAdminStatus, password } = req.body;
    if (id === _id) {
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
    const { currentUserId, currentUserAdminStatus } = req.body;
    if (id === currentUserId || currentUserAdminStatus) {
      try {
        await User.findByIdAndDelete(id);
        responseUtils.success(res, "User deleted successfully");
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
