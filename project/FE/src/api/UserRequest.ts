import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });

// Thêm interceptor để gắn token vào header nếu có
API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile") || "{}").token
    }`;
  }
  return req;
});

// API lấy thông tin người dùng theo ID
export const getUser = (userId: string) => API.get(`/user/${userId}`);

// // API lấy danh sách bạn bè của người dùng
// export const getUserFriends = (userId: string) =>
//   API.get(`/user/${userId}/friends`);

// API cập nhật thông tin người dùng
export const updateUser = (id: string, formData: any) => {
  // Ghi log để debug
  console.log("Request to update user:", { id });

  if (formData instanceof FormData) {
    // Đảm bảo currentUserId được thêm vào FormData và có dạng string
    formData.append("currentUserId", id.toString());

    // Debug: In ra các giá trị trong FormData
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
  } else {
    // Đối với dữ liệu JSON
    formData.currentUserId = id.toString();
    console.log("JSON payload:", formData);
  }

  // API request sẽ tự động gửi kèm token trong header thông qua interceptor ở đầu file
  return API.put(`/user/${id}`, formData);
};

// // API kết bạn với người dùng
// export const followUser = (id: string, currentUserId: string) =>
//   API.put(`/user/${id}/follow`, { currentUserId });

// // API hủy kết bạn
// export const unfollowUser = (id: string, currentUserId: string) =>
//   API.put(`/user/${id}/unfollow`, { currentUserId });
