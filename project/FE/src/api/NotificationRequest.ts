import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000", timeout: 10000 });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile") as string).token
    }`;
  }
  return req;
});

export const getUserNotifications = (
  userId: string,
  page: number = 1,
  limit: number = 10
) => API.get(`/notification/${userId}?page=${page}&limit=${limit}`);

export const markNotificationAsRead = (notificationId: number) =>
  API.put(`/notification/${notificationId}/read`);

export const markAllNotificationsAsRead = (userId: string) =>
  API.put(`/notification/user/${userId}/read-all`);

export const acceptFriendRequestNotification = (
  userId: string,
  friendId: string
) => API.post(`/user/${userId}/accept-friend/${friendId}`);

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
