import { Router } from "express";
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

// Get friends list
router.get("/:id/friends", wrap(getFriendsList));

// Get received friend requests
router.get("/:id/friend-requests/received", wrap(getReceivedFriendRequests));

// Get sent friend requests
router.get("/:id/friend-requests/sent", wrap(getSentFriendRequests));

router.use(authMiddleware);
// Update user
router.put("/:id", wrap(updateUser));

// Delete user
router.delete("/:id", wrap(deleteUser));

// Send friend request
router.post("/:id/friend-request", wrap(sendFriendRequest));

// Cancel friend request
router.delete("/:id/friend-request", wrap(cancelFriendRequest));

// Accept friend request
router.post("/:id/accept", wrap(acceptFriendRequest));

// Reject friend request
router.post("/:id/reject", wrap(rejectFriendRequest));

// Unfriend user
router.delete("/:id/unfriend", wrap(unfriendUser));

export default router;
