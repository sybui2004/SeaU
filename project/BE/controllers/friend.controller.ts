import User from "../models/user.model";
import { Request, Response } from "express";
import { responseUtils } from "../utils/response.utils";
export const friendController = {
  // Send friend request
  sendFriendRequest: async (req: Request, res: Response) => {
    const receiverId = req.params.id;
    const { currentUserId } = req.body;

    if (receiverId === currentUserId) {
      res.status(403).json("You cannot send a friend request to yourself");
      return;
    }

    try {
      const receiver = (await User.findById(receiverId)) as any;
      const sender = (await User.findById(currentUserId)) as any;

      if (!receiver || !sender) {
        res.status(404).json("User not found");
        return;
      }

      if (receiver.friends.includes(currentUserId)) {
        res.status(400).json("You are already friends with this user");
        return;
      }

      if (receiver.receivedFriendRequests.includes(currentUserId)) {
        res.status(400).json("Friend request already sent");
        return;
      }

      if (sender.receivedFriendRequests.includes(receiverId)) {
        res
          .status(400)
          .json(
            "This user already sent you a friend request. Accept it instead."
          );
        return;
      }

      await receiver.updateOne({
        $push: { receivedFriendRequests: currentUserId },
      });
      await sender.updateOne({
        $push: { sentFriendRequests: receiverId },
      });

      responseUtils.success(res, "Friend request sent successfully");
    } catch (error) {
      responseUtils.error(res, "Send friend request failed. Please try again.");
    }
  },

  // Cancel friend request
  cancelFriendRequest: async (req: Request, res: Response) => {
    const receiverId = req.params.id;
    const { currentUserId } = req.body;

    if (receiverId === currentUserId) {
      res.status(403).json("Invalid action");
      return;
    }

    try {
      const receiver = (await User.findById(receiverId)) as any;
      const sender = (await User.findById(currentUserId)) as any;
      if (!receiver || !sender) {
        res.status(404).json("User not found");
        return;
      }

      if (!receiver.receivedFriendRequests.includes(currentUserId)) {
        res.status(400).json("No friend request to cancel");
        return;
      }

      await receiver.updateOne({
        $pull: { receivedFriendRequests: currentUserId },
      });

      await sender.updateOne({
        $pull: { sentFriendRequests: receiverId },
      });
      responseUtils.success(res, "Friend request canceled successfully");
    } catch (error) {
      responseUtils.error(
        res,
        "Cancel friend request failed. Please try again."
      );
    }
  },

  // Accept friend request
  acceptFriendRequest: async (req: Request, res: Response) => {
    const senderId = req.params.id;
    const { currentUserId } = req.body;

    if (senderId === currentUserId) {
      res.status(403).json("Invalid action");
      return;
    }

    try {
      const receiver = (await User.findById(currentUserId)) as any;
      const sender = (await User.findById(senderId)) as any;

      if (!receiver || !sender) {
        res.status(404).json("User not found");
        return;
      }

      if (!receiver.receivedFriendRequests.includes(senderId)) {
        res.status(400).json("No friend request from this user");
        return;
      }

      await receiver.updateOne({
        $push: { friends: senderId },
        $pull: { receivedFriendRequests: senderId },
      });
      await sender.updateOne({
        $push: { friends: currentUserId },
        $pull: { sentFriendRequests: currentUserId },
      });

      responseUtils.success(res, "Friend request accepted successfully");
    } catch (error) {
      responseUtils.error(
        res,
        "Accept friend request failed. Please try again."
      );
    }
  },

  // Reject friend request
  rejectFriendRequest: async (req: Request, res: Response) => {
    const senderId = req.params.id;
    const { currentUserId } = req.body;

    if (senderId === currentUserId) {
      res.status(403).json("Invalid action");
      return;
    }

    try {
      const receiver = (await User.findById(currentUserId)) as any;
      const sender = (await User.findById(senderId)) as any;
      if (!receiver || !sender) {
        res.status(404).json("User not found");
        return;
      }

      if (!receiver.receivedFriendRequests.includes(senderId)) {
        res.status(400).json("No friend request from this user");
        return;
      }

      await receiver.updateOne({
        $pull: { receivedFriendRequests: senderId },
      });
      await sender.updateOne({
        $pull: { sentFriendRequests: currentUserId },
      });
      responseUtils.success(res, "Friend request rejected successfully");
    } catch (error) {
      responseUtils.error(
        res,
        "Reject friend request failed. Please try again."
      );
    }
  },

  // Unfriend
  unfriendUser: async (req: Request, res: Response) => {
    const friendId = req.params.id;
    const { currentUserId } = req.body;

    if (friendId === currentUserId) {
      res.status(403).json("Invalid action");
      return;
    }

    try {
      const currentUser = (await User.findById(currentUserId)) as any;
      const friend = (await User.findById(friendId)) as any;

      if (!currentUser || !friend) {
        res.status(404).json("User not found");
        return;
      }

      if (!currentUser.friends.includes(friendId)) {
        res.status(400).json("You are not friends with this user");
        return;
      }

      await currentUser.updateOne({ $pull: { friends: friendId } });
      await friend.updateOne({ $pull: { friends: currentUserId } });

      responseUtils.success(res, "Unfriended successfully");
    } catch (error) {
      responseUtils.error(res, "Unfriend failed. Please try again.");
    }
  },
};
