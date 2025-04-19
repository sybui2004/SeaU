import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000" });
export interface PostData {
  userId: string;
  content?: string;
  image?: string;
}
export const uploadImage = (data: FormData) => API.post("/upload", data);
export const uploadPost = (data: PostData) => API.post("/post", data);
