import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000", timeout: 10000 });

// Thêm interceptor để tự động thêm token vào header
API.interceptors.request.use((req) => {
  try {
    const token = localStorage.getItem("authToken");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    } else {
      // Nếu không có token trực tiếp, thử lấy từ profile
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

export const getMessages = (id: string) => API.get(`/message/${id}`);

export const addMessage = (data: any) => API.post("/message/", data);

export const updateMessage = (id: string, data: any) =>
  API.put(`/message/${id}`, data);

export const deleteMessage = (id: string) => API.delete(`/message/${id}`);
