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

import authMiddleWare from "../middleware/auth.middleware";
const router = Router();

// Get user by id
router.get("/:id", getUser);

// Update user
router.put("/:id", authMiddleWare, updateUser);

// Delete user
router.delete("/:id", authMiddleWare, deleteUser);

// Send friend request
router.post("/:id/friend-request", authMiddleWare, sendFriendRequest);

// Cancel friend request
router.delete("/:id/friend-request", authMiddleWare, cancelFriendRequest);

// Accept friend request
router.post("/:id/accept", authMiddleWare, acceptFriendRequest);

// Reject friend request
router.post("/:id/reject", authMiddleWare, rejectFriendRequest);

// Unfriend user
router.delete("/:id/unfriend", authMiddleWare, unfriendUser);

// Get friends list
router.get(
  "/:id/friends",
  (req: Request, res: Response, next: NextFunction) => {
    getFriendsList(req, res).catch(next);
  }
);

// Get received friend requests
router.get(
  "/:id/friend-requests/received",
  (req: Request, res: Response, next: NextFunction) => {
    getReceivedFriendRequests(req, res).catch(next);
  }
);

// Get sent friend requests
router.get(
  "/:id/friend-requests/sent",
  (req: Request, res: Response, next: NextFunction) => {
    getSentFriendRequests(req, res).catch(next);
  }
);

export default router;
