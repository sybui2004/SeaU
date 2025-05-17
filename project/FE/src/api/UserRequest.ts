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

export const getAllUsers = (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  status: string = "all"
) => {
  let query = `page=${page}&limit=${limit}`;
  if (search) query += `&search=${search}`;
  if (status !== "all") query += `&status=${status}`;

  return API.get(`/admin/users?${query}`);
};

export const getUserDetail = (userId: string) =>
  API.get(`/admin/users/${userId}`);

export const deleteUser = (userId: string, hardDelete: boolean = false) =>
  API.delete(`/admin/users/${userId}${hardDelete ? "?hard_delete=true" : ""}`);

export const updateUserByAdmin = (userId: string, userData: any) =>
  API.put(`/admin/users/${userId}`, userData);

export const sendFriendRequest = (id: string, currentUserId: string) =>
  API.post(`/user/${id}/friend-request`, { currentUserId });

export const acceptFriendRequest = (id: string, currentUserId: string) =>
  API.post(`/user/${id}/accept`, { currentUserId });

export const rejectFriendRequest = (id: string, currentUserId: string) =>
  API.post(`/user/${id}/reject`, { currentUserId });

export const cancelFriendRequest = (id: string, currentUserId: string) =>
  API.delete(`/user/${id}/friend-request`, { data: { currentUserId } });

export const unfriendUser = (id: string, currentUserId: string) =>
  API.delete(`/user/${id}/unfriend`, { data: { currentUserId } });

export const getFriendsList = (
  userId: string,
  page: number = 1,
  limit: number = 10
) => API.get(`/user/${userId}/friends?page=${page}&limit=${limit}`);

export const getReceivedFriendRequests = (
  userId: string,
  page: number = 1,
  limit: number = 10
) =>
  API.get(
    `/user/${userId}/friend-requests/received?page=${page}&limit=${limit}`
  );

export const getSentFriendRequests = (
  userId: string,
  page: number = 1,
  limit: number = 10
) =>
  API.get(`/user/${userId}/friend-requests/sent?page=${page}&limit=${limit}`);

export const getDashboardStats = () => {
  return API.get(`/admin/stats`);
};

export const getTopUsers = (limit: number = 5, sortBy: string = "posts") => {
  return API.get(`/admin/users?page=1&limit=${limit}&sort=${sortBy}`);
};
