import { Document } from "mongoose";

export interface ISocialMedia {
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other";
  dob?: Date | null;
  phone?: string | null;
  address?: string | null;
  isAdmin: boolean;
  profilePic: string;
  status: "active" | "inactive" | "banned";
  socialMedia: ISocialMedia;
  bio?: string | null;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  friends: IUser[];
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other";
  isAdmin: boolean;
  profilePic: string;
  dob?: Date;
  phone?: string;
  address?: string;
  bio?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  status?: "active" | "inactive" | "banned";
}
