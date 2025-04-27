import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000", timeout: 10000 });

API.interceptors.request.use((req) => {
  try {
    const token = localStorage.getItem("authToken");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    } else {
      const profileData = localStorage.getItem("profile");
      if (profileData) {
        const profile = JSON.parse(profileData);
        if (profile && profile.token) {
          req.headers.Authorization = `Bearer ${profile.token}`;
        }
      }
    }
  } catch (error) {
    console.error("Lỗi khi xử lý token:", error);
  }
  return req;
});

export const getAllConversations = (id: any) => API.get(`/conversation/${id}`);
export const getConversationById = (id: any) =>
  API.get(`/conversation/get/${id}`);

export const createConversation = (data: any) =>
  API.post("/conversation/", data);

export const createGroupConversation = (data: any) =>
  API.post("/conversation/group", data);

export const findConversation = (firstId: any, secondId: any) =>
  API.get(`/conversation/find/${firstId}/${secondId}`);

export const deleteConversation = (id: any) =>
  API.delete(`/conversation/${id}`);

export const addToGroup = (id: any, data: any) =>
  API.put(`/conversation/group/add/${id}`, data);

export const removeFromGroup = (id: any, data: any) =>
  API.put(`/conversation/group/remove/${id}`, data);

export const updateConversation = (id: any, data: any) =>
  API.put(`/conversation/${id}`, data);
