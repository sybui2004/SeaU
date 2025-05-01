import * as UserApi from "../api/UserRequest";

export const getUserProfile = (userId: string) => {
  return async (dispatch: any) => {
    dispatch({ type: "USER_PROFILE_LOADING" });
    try {
      const { data } = await UserApi.getUser(userId);
      dispatch({ type: "USER_PROFILE_SUCCESS", data: data });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      dispatch({ type: "USER_PROFILE_FAIL" });
    }
  };
};

export const updateUser = (id: string, formData: any) => {
  return async (dispatch: any) => {
    dispatch({ type: "UPDATING_START" });
    try {
      const { data } = await UserApi.updateUser(id, formData);
      dispatch({ type: "UPDATING_SUCCESS", data: data });
    } catch (error) {
      dispatch({ type: "UPDATING_FAIL" });
    }
  };
};

//Action gửi lời mời kết bạn với người dùng
export const sendFriendRequest = (
  receiverUserId: string,
  currentUserId: string
) => {
  return async (dispatch: any) => {
    try {
      await UserApi.sendFriendRequest(receiverUserId, currentUserId);
      dispatch({ type: "SEND_FRIEND_REQUEST", data: receiverUserId });
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };
};

//Action hủy lời mời kết bạn với người dùng
export const cancelFriendRequest = (
  receiverUserId: string,
  currentUserId: string
) => {
  return async (dispatch: any) => {
    try {
      await UserApi.cancelFriendRequest(receiverUserId, currentUserId);
      dispatch({ type: "CANCEL_FRIEND_REQUEST", data: receiverUserId });
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };
};

//Action chấp nhận lời mời kết bạn với người dùng
export const acceptFriendRequest = (
  receiverUserId: string,
  currentUserId: string
) => {
  return async (dispatch: any) => {
    try {
      await UserApi.acceptFriendRequest(receiverUserId, currentUserId);
      dispatch({ type: "ACCEPT_FRIEND_REQUEST", data: receiverUserId });
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };
};

//Action từ chối lời mời kết bạn với người dùng
export const rejectFriendRequest = (
  receiverUserId: string,
  currentUserId: string
) => {
  return async (dispatch: any) => {
    try {
      await UserApi.rejectFriendRequest(receiverUserId, currentUserId);
      dispatch({ type: "REJECT_FRIEND_REQUEST", data: receiverUserId });
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };
};

//Action hủy kết bạn với người dùng
export const unfriendUser = (receiverUserId: string, currentUserId: string) => {
  return async (dispatch: any) => {
    try {
      await UserApi.unfriendUser(receiverUserId, currentUserId);
      dispatch({ type: "UNFRIEND_USER", data: receiverUserId });
    } catch (error) {
      console.error("Error unfriending user:", error);
    }
  };
};
