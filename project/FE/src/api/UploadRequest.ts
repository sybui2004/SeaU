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
export const uploadFile = async (
  file: File,
  customFileName?: string,
  fileType: "image" | "audio" | "video" | "document" = "image"
) => {
  try {
    const formData = new FormData();
    const uniqueFileName = customFileName || `${Date.now()}_${file.name}`;
    formData.append("name", uniqueFileName);
    formData.append("file", file);

    formData.append("fileType", fileType);

    console.log("Uploading file:", {
      name: file.name,
      size: file.size,
      type: file.type,
      customName: uniqueFileName,
      fileType: fileType,
    });

    const response = await API.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
export const uploadImage = (data: FormData) => API.post("/upload", data);
export const uploadPost = (data: PostData) => API.post("/post", data);
export default API;
