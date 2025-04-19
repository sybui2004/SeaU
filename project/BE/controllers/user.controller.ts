import { profileController } from "./profile.controller";
import { friendController } from "./friend.controller";
import { blockController } from "./block.controller";

export const getUser = profileController.getUser;
export const updateUser = profileController.updateUser;
export const deleteUser = profileController.deleteUser;

export const sendFriendRequest = friendController.sendFriendRequest;
export const cancelFriendRequest = friendController.cancelFriendRequest;
export const acceptFriendRequest = friendController.acceptFriendRequest;
export const rejectFriendRequest = friendController.rejectFriendRequest;
export const unfriendUser = friendController.unfriendUser;

export const blockUser = blockController.blockUser;
export const unblockUser = blockController.unblockUser;
