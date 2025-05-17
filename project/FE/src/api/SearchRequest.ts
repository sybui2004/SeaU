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

export const searchApi = async (query: string, page: number = 1) => {
  try {
    const encoded = encodeURIComponent(query);
    const response = await API.get(`/search?q=${encoded}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Search API error:", error);
    throw error;
  }
};

export const searchUsersApi = async (query: string, page: number = 1) => {
  try {
    const encoded = encodeURIComponent(query);
    const response = await API.get(`/search/users?q=${encoded}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error("User search API error:", error);
    throw error;
  }
};

export const searchPostsApi = async (query: string, page: number = 1) => {
  try {
    const encoded = encodeURIComponent(query);
    const response = await API.get(`/search/posts?q=${encoded}&page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Post search API error:", error);
    throw error;
  }
};

export default {
  searchApi,
  searchUsersApi,
  searchPostsApi,
};
