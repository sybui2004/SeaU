import mongoose, { Document } from "mongoose";
export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;

  parent?: mongoose.Types.ObjectId;
  isPinned: boolean;
  isDeleted: boolean;
  isEdited: boolean;
  likes: mongoose.Types.ObjectId[];
  replies: mongoose.Types.ObjectId[];
  metadata: Record<string, any>;
}
