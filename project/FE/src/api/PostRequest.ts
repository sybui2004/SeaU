import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });

// User Posts
export const getTimelinePost = (id: string, page: number, limit: number) =>
  API.get(`/post/${id}/timeline?page=${page}&limit=${limit}`);
export const likePost = (id: string, userId: string) =>
  API.put(`/post/${id}/like`, { userId: userId });
