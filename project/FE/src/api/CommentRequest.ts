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

export const getCommentsByPostId = (postId: string, page = 1, limit = 10) =>
  API.get(`/comment/post/${postId}?page=${page}&limit=${limit}`);

export const createComment = (data: any) => API.post("/comment", data);

export const updateComment = (id: string, data: any) =>
  API.put(`/comment/${id}`, data);

export const deleteComment = (
  id: string,
  userId: string,
  isAdmin: boolean = false
) =>
  API.delete(`/comment/${id}`, {
    data: { userId, isAdmin: isAdmin },
  });

export const likeComment = (id: string, userId: string) =>
  API.put(`/comment/${id}/like`, { userId });

export const getRepliesByCommentId = (
  commentId: string,
  page = 1,
  limit = 10
) => API.get(`/comment/${commentId}/replies?page=${page}&limit=${limit}`);

export const createReply = (commentId: string, data: any) =>
  API.post(`/comment/${commentId}/reply`, data);

export const getAllCommentsForAdminDashboard = (
  page: number = 1,
  limit: number = 10,
  search: string = ""
) => API.get(`/comment/admin/all?page=${page}&limit=${limit}&search=${search}`);

export const getAllCommentsForAdmin = (
  userId: string,
  page: number = 1,
  limit: number = 10
) => API.get(`/comment/admin/user/${userId}?page=${page}&limit=${limit}`);

export const updateCommentAsAdmin = (id: string, data: any) =>
  API.put(`/comment/${id}`, { ...data, isAdmin: true });
