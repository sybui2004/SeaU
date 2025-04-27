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
export interface PostData {
  userId: string;
  content?: string;
  image?: string;
}
export const uploadImage = (data: FormData) => API.post("/upload", data);
export const uploadPost = (data: PostData) => API.post("/post", data);
