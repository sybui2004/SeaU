import mongoose, { Document } from "mongoose";
type ReactionType = "like" | "love" | "haha" | "sad" | "angry";

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  comment: mongoose.Types.ObjectId;
  type: ReactionType;
  isDeleted: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
