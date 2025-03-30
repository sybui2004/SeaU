import { create } from "zustand";
import { User, CreateUserRequest, LoginUserRequest } from "../interfaces/User";

interface AuthStore {
  users: User[];
  setUsers: (users: User[]) => void;
  createUser: (newUser: CreateUserRequest) => Promise<{
    success: boolean;
    message: string;
    errors?: Record<string, boolean>;
  }>;
  loginUser: (
    user: LoginUserRequest
  ) => Promise<{ success: boolean; message: string }>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  users: [],
  setUsers: (users: User[]) => set({ users }),
  createUser: async (newUser: CreateUserRequest) => {
    // Chuẩn bị dữ liệu gửi lên server
    const userData = {
      ...newUser,
      isAdmin: newUser.isAdmin || false,
      bio: newUser.bio || "",
      phone: newUser.phone || "",
      address: newUser.address || "",
      socialMedia: newUser.socialMedia || {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
      },
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        set((state) => ({
          users: [...state.users, data.data],
        }));
        return {
          success: true,
          message: data.message || "Registered successfully",
        };
      } else {
        return {
          success: false,
          message: data.message,
          errors: data.missingFields,
        };
      }
    } catch (error: any) {
      console.error("Network error:", error);
      return {
        success: false,
        message: "Connection error. Please try again later.",
      };
    }
  },
  loginUser: async (user: LoginUserRequest) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        set({ users: data.data });
        return {
          success: true,
          message: data.message || "Logged in successfully",
        };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error: any) {
      console.error("Network error:", error);
      return {
        success: false,
        message: "Connection error. Please try again later.",
      };
    }
  },
}));
