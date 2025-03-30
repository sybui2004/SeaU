import mongoose, { Document } from "mongoose";
type PostCategory = "technology" | "lifestyle" | "travel" | "food" | "other";
type PostVisibility = "public" | "private";
type PostStatus = "draft" | "published" | "archived";

export interface IPost extends Document {
  title: string;
  content: string;
  tags: string[];
  bannerImage: string;
  visibility: PostVisibility;
  featured: boolean;
  category: PostCategory;
  status: PostStatus;
  isDeleted: boolean;
  author: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  views: number;
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}
