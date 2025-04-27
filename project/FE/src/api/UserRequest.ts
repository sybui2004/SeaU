import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile") as string).token
    }`;
  }

  return req;
});

export const getUser = (userId: string) => API.get(`/user/${userId}`);

export const updateUser = (id: string, formData: any) =>
  API.put(`/user/${id}`, formData);

// API kết bạn với người dùng
export const sendFriendRequest = (id: string, currentUserId: string) =>
  API.post(`/user/${id}/friend-request`, { currentUserId });

// API chấp nhận kết bạn
export const acceptFriendRequest = (id: string, currentUserId: string) =>
  API.post(`/user/${id}/accept`, { currentUserId });

// API từ chối kết bạn
export const rejectFriendRequest = (id: string, currentUserId: string) =>
  API.post(`/user/${id}/reject`, { currentUserId });

// API hủy lời mời kết bạn
export const cancelFriendRequest = (id: string, currentUserId: string) =>
  API.delete(`/user/${id}/friend-request`, { data: { currentUserId } });

// API hủy kết bạn
export const unfriendUser = (id: string, currentUserId: string) =>
  API.delete(`/user/${id}/unfriend`, { data: { currentUserId } });

// API lấy danh sách bạn bè
export const getFriendsList = (
  userId: string,
  page: number = 1,
  limit: number = 10
) => API.get(`/user/${userId}/friends?page=${page}&limit=${limit}`);

// API lấy danh sách lời mời kết bạn đã nhận
export const getReceivedFriendRequests = (
  userId: string,
  page: number = 1,
  limit: number = 10
) =>
  API.get(
    `/user/${userId}/friend-requests/received?page=${page}&limit=${limit}`
  );

// API lấy danh sách lời mời kết bạn đã gửi
export const getSentFriendRequests = (
  userId: string,
  page: number = 1,
  limit: number = 10
) =>
  API.get(`/user/${userId}/friend-requests/sent?page=${page}&limit=${limit}`);
