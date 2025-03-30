export interface ISocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other";
  dob?: Date;
  phone?: string;
  address?: string;
  isAdmin?: boolean;
  profilePic: string;
  status?: "active" | "inactive" | "banned";
  socialMedia?: ISocialMedia;
  bio?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  friends?: string[] | User[];
}

export interface UserResponse {
  success: boolean;
  message: string;
  data?: User;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other";
  profilePic: string;
  isAdmin?: boolean;
  dob?: Date;
  phone?: string;
  address?: string;
  bio?: string;
  socialMedia?: ISocialMedia;
}

export type UpdateUserRequest = Partial<CreateUserRequest> & {
  status?: "active" | "inactive" | "banned";
};

export type LoginUserRequest = Pick<User, "email" | "password">;
