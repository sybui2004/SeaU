import API from "./AxiosConfig";

// Lấy thông báo của người dùng
export const getUserNotifications = (
  userId: string,
  page: number = 1,
  limit: number = 10
) => API.get(`/notification/${userId}?page=${page}&limit=${limit}`);

// Đánh dấu thông báo đã đọc
export const markNotificationAsRead = (notificationId: number) =>
  API.put(`/notification/${notificationId}/read`);

// Đánh dấu tất cả thông báo của người dùng đã đọc
export const markAllNotificationsAsRead = (userId: string) =>
  API.put(`/notification/user/${userId}/read-all`);

// API chấp nhận lời mời kết bạn
export const acceptFriendRequestNotification = (
  userId: string,
  friendId: string
) => API.post(`/user/${userId}/accept-friend/${friendId}`);

// API từ chối lời mời kết bạn
export const rejectFriendRequestNotification = (
  userId: string,
  friendId: string
) => API.post(`/user/${userId}/reject-friend/${friendId}`);

export default {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  acceptFriendRequestNotification,
  rejectFriendRequestNotification,
};
