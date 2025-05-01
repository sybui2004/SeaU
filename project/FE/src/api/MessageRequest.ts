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

export const getMessages = (id: string) => API.get(`/message/${id}`);

export const addMessage = (data: any) => API.post("/message/", data);

export const updateMessage = (id: string, data: any) =>
  API.put(`/message/${id}`, data);

export const deleteMessage = (id: string) => API.delete(`/message/${id}`);
