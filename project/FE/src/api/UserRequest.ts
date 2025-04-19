import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });

export const getUser = (userId: string) => API.get(`/user/${userId}`);

export const updateUser = (id: string, formData: any) =>
  API.put(`/user/${id}`, formData);

// // API lấy danh sách bạn bè của người dùng
// export const getUserFriends = (userId: string) =>
//   API.get(`/user/${userId}/friends`);

// // API kết bạn với người dùng
// export const followUser = (id: string, currentUserId: string) =>
//   API.put(`/user/${id}/follow`, { currentUserId });

// // API hủy kết bạn
// export const unfollowUser = (id: string, currentUserId: string) =>
//   API.put(`/user/${id}/unfollow`, { currentUserId });
