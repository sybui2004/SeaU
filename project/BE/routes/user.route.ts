import { Router, Request, Response } from "express";
import {
  getUser,
  updateUser,
  deleteUser,
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriendUser,
  blockUser,
  unblockUser,
} from "../controllers/user.controller";

const router = Router();

// Routes
router.get("/", async (req: Request, res: Response) => {
  res.send("<h1>Welcome to User API</h1>");
});

router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.post("/:id/friend-request", sendFriendRequest);
router.delete("/:id/friend-request", cancelFriendRequest);
router.post("/:id/accept", acceptFriendRequest);
router.post("/:id/reject", rejectFriendRequest);
router.delete("/:id/unfriend", unfriendUser);

// Block routes
router.post("/:id/block", blockUser);
router.post("/:id/unblock", unblockUser);
router.delete("/:id/unfriend", unfriendUser);
export default router;
