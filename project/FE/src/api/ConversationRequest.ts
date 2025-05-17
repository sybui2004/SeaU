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

// Get all conversations for a user
export const getUserConversations = (userId: string, page = 1, limit = 10) =>
  API.get(`/conversation/user/${userId}?page=${page}&limit=${limit}`);

// Get a single conversation
export const getConversation = (conversationId: string) =>
  API.get(`/conversation/${conversationId}`);

// Find conversation between two users
export const findConversation = (firstUserId: string, secondUserId: string) =>
  API.get(`/conversation/find/${firstUserId}/${secondUserId}`);

// Create a new conversation
export const createConversation = (senderId: string, receiverId: string) =>
  API.post(`/conversation`, { senderId, receiverId });

// Create a group chat
export const createGroupChat = (
  name: string,
  members: string[],
  admin: string
) => API.post(`/conversation/group`, { name, members, admin });

// Delete a conversation
export const deleteConversation = (conversationId: string, userId: string) =>
  API.delete(`/conversation/${conversationId}`, { data: { userId } });

// Add user to group
export const addToGroup = (
  conversationId: string,
  userToAddId: string,
  adminId: string
) =>
  API.put(`/conversation/addToGroup`, {
    conversationId,
    userToAddId,
    adminId,
  });

// Remove user from group
export const removeFromGroup = (
  conversationId: string,
  userToDelId: string,
  adminId: string
) =>
  API.put(`/conversation/removeFromGroup`, {
    conversationId,
    userToDelId,
    adminId,
  });

// Update conversation
export const updateConversation = (
  conversationId: string,
  groupName: string,
  groupAvatar: string,
  userId: string
) =>
  API.put(`/conversation/${conversationId}`, {
    groupName,
    groupAvatar,
    userId,
  });

// === ADMIN FUNCTIONS ===

// Get all conversations (admin only)
export const getAllConversationsForAdmin = (
  page: number = 1,
  limit: number = 10,
  search: string = ""
) => {
  let query = `/admin/conversations?page=${page}&limit=${limit}`;

  if (search) {
    query += `&search=${encodeURIComponent(search)}`;
  }

  console.log("Calling API with URL:", query);
  return API.get(query);
};

// Get conversation details (admin only)
export const getConversationDetailsForAdmin = (conversationId: string) =>
  API.get(`/conversation/admin/${conversationId}`);

// Delete conversation as admin
export const deleteConversationAsAdmin = (conversationId: string) =>
  API.delete(`/conversation/admin/${conversationId}`);
