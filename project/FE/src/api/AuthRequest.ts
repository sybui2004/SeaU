import axios from "axios";

export interface FormData {
  fullname?: string;
  username: string;
  password: string;
}

const API = axios.create({ baseURL: "http://localhost:3000" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile") as string).token
    }`;
  }

  return req;
});
export const logIn = (formData: FormData) => API.post("/auth/login", formData);

export const signUp = (formData: FormData) =>
  API.post("/auth/register", formData);
