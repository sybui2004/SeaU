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

export interface MessageData {
  senderId: string;
  conversationId: string;
  text?: string;
  fileType?: "image" | "audio" | "video" | "other" | null;
  fileData?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  chatId?: string;
  receiverId?: string;
}

// Get messages
export const getMessages = (conversationId: string, page = 1, limit = 20) =>
  API.get(`/message/${conversationId}?page=${page}&limit=${limit}`);

// Add a new message
export const addMessage = (data: MessageData) => API.post("/message/", data);

// Update a message
export const updateMessage = (id: string, data: any) =>
  API.put(`/message/${id}`, data);

// Delete a message
export const deleteMessage = (
  id: string,
  userId: string,
  isAdmin: boolean = false
) => API.delete(`/message/${id}`, { data: { userId, isAdmin } });

// Get all messages for a conversation (admin only)
export const getAllMessagesForAdmin = (
  conversationId: string,
  page: number = 1,
  limit: number = 10,
  search: string = ""
) => {
  let query = `/message/admin/${conversationId}?page=${page}&limit=${limit}`;
  if (search) {
    query += `&search=${encodeURIComponent(search)}`;
  }
  return API.get(query);
};

export const getMessagesByUserId = (userId: string, page = 1, limit = 20) =>
  API.get(`/message/user/${userId}?page=${page}&limit=${limit}`);

// Update a message as admin
export const updateMessageAsAdmin = (id: string, data: any) =>
  API.put(`/message/admin/${id}`, { ...data, isAdmin: true });

// Delete a message as admin
export const deleteMessageAsAdmin = (id: string) =>
  API.delete(`/message/admin/${id}`);

// Mark as read
export const markAsRead = (messageId: string, userId: string) =>
  API.put(`/message/${messageId}/read`, { userId });
