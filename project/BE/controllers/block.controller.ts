import User from "../models/user.model";
import { Request, Response } from "express";
import { responseUtils } from "../utils/response.utils";

export const blockController = {
  // Block user
  blockUser: async (req: Request, res: Response) => {
    const blockUserId = req.params.id;
    const { currentUserId } = req.body;

    if (blockUserId === currentUserId) {
      res.status(403).json("You cannot block yourself");
      return;
    }

    try {
      const currentUser = (await User.findById(currentUserId)) as any;
      const userToBlock = (await User.findById(blockUserId)) as any;

      if (!currentUser || !userToBlock) {
        res.status(404).json("User not found");
        return;
      }

      // Initialize blockedUsers array if it doesn't exist
      if (!currentUser.blockedUsers) {
        await User.findByIdAndUpdate(currentUserId, {
          $set: { blockedUsers: [] },
        });
        currentUser.blockedUsers = [];
      }

      if (currentUser.blockedUsers.includes(blockUserId)) {
        res.status(400).json("User is already blocked");
        return;
      }

      await currentUser.updateOne({ $push: { blockedUsers: blockUserId } });

      if (currentUser.friends.includes(blockUserId)) {
        await currentUser.updateOne({ $pull: { friends: blockUserId } });
        await userToBlock.updateOne({ $pull: { friends: currentUserId } });
      }

      if (currentUser.pendingFriendRequests.includes(blockUserId)) {
        await currentUser.updateOne({
          $pull: { pendingFriendRequests: blockUserId },
        });
      }

      if (userToBlock.pendingFriendRequests.includes(currentUserId)) {
        await userToBlock.updateOne({
          $pull: { pendingFriendRequests: currentUserId },
        });
      }

      responseUtils.success(res, "User blocked successfully");
    } catch (error) {
      responseUtils.error(res, "Block user failed. Please try again.");
    }
  },

  // Unblock user
  unblockUser: async (req: Request, res: Response) => {
    const unblockUserId = req.params.id;
    const { currentUserId } = req.body;

    if (unblockUserId === currentUserId) {
      res.status(403).json("Invalid action");
      return;
    }

    try {
      const currentUser = (await User.findById(currentUserId)) as any;

      if (!currentUser) {
        res.status(404).json("User not found");
        return;
      }

      // Check if blocked
      if (
        !currentUser.blockedUsers ||
        !currentUser.blockedUsers.includes(unblockUserId)
      ) {
        res.status(400).json("User is not blocked");
        return;
      }

      // Remove from blocked list
      await currentUser.updateOne({ $pull: { blockedUsers: unblockUserId } });

      responseUtils.success(res, "User unblocked successfully");
    } catch (error) {
      responseUtils.error(res, "Unblock user failed. Please try again.");
    }
  },
};
