import { Router, Request, Response, NextFunction } from "express";
import {
  getUser,
  updateUser,
  deleteUser,
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriendUser,
  getFriendsList,
  getReceivedFriendRequests,
  getSentFriendRequests,
} from "../controllers/user.controller";

import authMiddleware from "../middleware/auth.middleware";
import wrap from "./wrap";

const router = Router();

// Get user by id
router.get("/:id", wrap(getUser));

// Update user
router.put("/:id", authMiddleware, wrap(updateUser));

// Delete user
router.delete("/:id", authMiddleware, wrap(deleteUser));

// Send friend request
router.post("/:id/friend-request", authMiddleware, wrap(sendFriendRequest));

// Cancel friend request
router.delete("/:id/friend-request", authMiddleware, wrap(cancelFriendRequest));

// Accept friend request
router.post("/:id/accept", authMiddleware, wrap(acceptFriendRequest));

// Reject friend request
router.post("/:id/reject", authMiddleware, wrap(rejectFriendRequest));

// Unfriend user
router.delete("/:id/unfriend", authMiddleware, wrap(unfriendUser));

// Get friends list
router.get("/:id/friends", wrap(getFriendsList));

// Get received friend requests
router.get("/:id/friend-requests/received", wrap(getReceivedFriendRequests));

// Get sent friend requests
router.get("/:id/friend-requests/sent", wrap(getSentFriendRequests));

export default router;
