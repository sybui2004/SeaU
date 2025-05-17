import * as NotificationApi from "../api/NotificationRequest";

type ThunkAction = (dispatch: any) => Promise<void>;

export const getNotifications = (userId: string): ThunkAction => {
  return async (dispatch: any) => {
    dispatch({ type: "NOTIFICATION_LOADING" });
    try {
      const { data } = await NotificationApi.getUserNotifications(userId);
      dispatch({ type: "NOTIFICATION_SUCCESS", data: data });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      dispatch({ type: "NOTIFICATION_FAIL" });
    }
  };
};

export const markAsRead = (notificationId: number): ThunkAction => {
  return async (dispatch: any) => {
    try {
      await NotificationApi.markNotificationAsRead(notificationId);
      dispatch({ type: "MARK_NOTIFICATION_READ", data: notificationId });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
};

export const markAllAsRead = (userId: string): ThunkAction => {
  return async (dispatch: any) => {
    try {
      await NotificationApi.markAllNotificationsAsRead(userId);
      dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };
};

export const acceptFriendRequest = (
  userId: string,
  friendId: string
): ThunkAction => {
  return async (dispatch: any) => {
    try {
      await NotificationApi.acceptFriendRequestNotification(userId, friendId);
      dispatch({ type: "ACCEPT_FRIEND_REQUEST_NOTIFICATION", data: friendId });
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };
};

export const rejectFriendRequest = (
  userId: string,
  friendId: string
): ThunkAction => {
  return async (dispatch: any) => {
    try {
      await NotificationApi.rejectFriendRequestNotification(userId, friendId);
      dispatch({ type: "REJECT_FRIEND_REQUEST_NOTIFICATION", data: friendId });
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };
};
