import axios from "axios";

export interface FormData {
  fullname?: string;
  username: string;
  password: string;
}

const API = axios.create({ baseURL: "http://localhost:3000" });

export const logIn = (formData: FormData) => API.post("/auth/login", formData);

export const signUp = (formData: FormData) =>
  API.post("/auth/register", formData);
