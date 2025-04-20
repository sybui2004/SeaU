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
} from "../controllers/user.controller";

const router = Router();

// Get user by id
router.get("/:id", getUser);

// Update user
router.put("/:id", updateUser);

// Delete user
router.delete("/:id", deleteUser);

// Send friend request
router.post("/:id/friend-request", sendFriendRequest);

// Cancel friend request
router.delete("/:id/friend-request", cancelFriendRequest);

// Accept friend request
router.post("/:id/accept", acceptFriendRequest);

// Reject friend request
router.post("/:id/reject", rejectFriendRequest);

// Unfriend user
router.delete("/:id/unfriend", unfriendUser);

export default router;
