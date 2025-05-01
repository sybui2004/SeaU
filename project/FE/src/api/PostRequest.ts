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

export const createPost = (data: any) => API.post("/post", data);
export const getPost = (id: string) => API.get(`/post/${id}`);
export const updatePost = (id: string, data: any) =>
  API.put(`/post/${id}`, data);
export const deletePost = (id: string) => API.delete(`/post/${id}`);
export const getTimelinePost = (id: string, page: number, limit: number) =>
  API.get(`/post/${id}/timeline?page=${page}&limit=${limit}`);
export const likePost = (id: string, userId: string) =>
  API.put(`/post/${id}/like`, { userId: userId });

export const getUserPosts = (id: string) => API.get(`/post/user/${id}`);
