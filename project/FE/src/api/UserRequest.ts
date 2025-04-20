import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });

export const getUser = (userId: string) => API.get(`/user/${userId}`);

export const updateUser = (id: string, formData: any) =>
  API.put(`/user/${id}`, formData);

// // API lấy danh sách bạn bè của người dùng
// export const getUserFriends = (userId: string) =>
//   API.get(`/user/${userId}/friends`);

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
