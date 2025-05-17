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

export const createPost = (data: any) => API.post("/post", data);

export const getTimelinePosts = (id: string, page = 1, limit = 10) =>
  API.get(`/post/${id}/timeline?page=${page}&limit=${limit}`);

export const getPostById = (id: string) => API.get(`/post/${id}`);

export const updatePost = (id: string, data: any) =>
  API.put(`/post/${id}`, data);

export const deletePost = (
  id: string,
  userId: string,
  isAdmin: boolean = false
) => API.delete(`/post/${id}`, { data: { userId, isAdmin } });

export const likePost = (id: string, userId: string) =>
  API.put(`/post/${id}/like`, { userId });

export const getPostComments = (id: string, page = 1, limit = 10) =>
  API.get(`/comment/post/${id}?page=${page}&limit=${limit}`);

export const getAllPostsForAdmin = (
  page: number = 1,
  limit: number = 10,
  search: string = ""
) => {
  let query = `/post/admin?page=${page}&limit=${limit}`;

  if (search) query += `&search=${encodeURIComponent(search)}`;

  return API.get(query);
};

export const getUserPosts = (userId: string, page = 1, limit = 10) =>
  API.get(`/post/user/${userId}?page=${page}&limit=${limit}`);

export const updatePostAsAdmin = (id: string, data: any) =>
  API.put(`/post/${id}`, { ...data, isAdmin: true });

export const deletePostAsAdmin = (id: string) =>
  API.delete(`/post/${id}`, { data: { isAdmin: true } });

export const updatePostWithImage = (id: string, formData: FormData) => {
  return API.put(`/post/${id}/with-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
