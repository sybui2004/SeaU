// Define notification types
export enum NotificationType {
  FRIEND_REQUEST = "FRIEND_REQUEST",
  FRIEND_REQUEST_ACCEPTED = "FRIEND_REQUEST_ACCEPTED",
  LIKE = "LIKE",
  COMMENT = "COMMENT",
}

interface Notification {
  id: number;
  type: NotificationType;
  text: string;
  time: string;
  read: boolean;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  postId?: string;
  linkTo?: string;
}

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: false,
};

const notificationReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "NOTIFICATION_LOADING":
      return { ...state, loading: true, error: false };

    case "NOTIFICATION_SUCCESS":
      return {
        ...state,
        notifications: action.data,
        loading: false,
        error: false,
      };

    case "NOTIFICATION_FAIL":
      return { ...state, loading: false, error: true };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.data
            ? { ...notification, read: true }
            : notification
        ),
      };

    case "MARK_ALL_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read: true,
        })),
      };

    case "ACCEPT_FRIEND_REQUEST_NOTIFICATION":
    case "REJECT_FRIEND_REQUEST_NOTIFICATION":
      // Có thể xóa thông báo khỏi danh sách hoặc đánh dấu đã xử lý
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) =>
            !(
              notification.type === NotificationType.FRIEND_REQUEST &&
              notification.userId === action.data
            )
        ),
      };

    default:
      return state;
  }
};

export default notificationReducer;
