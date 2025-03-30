import mongoose, { Document } from "mongoose";
type Role = "admin" | "member";
export interface IConversationUser extends Document {
  conversation: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  role: Role;
  isDeleted: boolean;
  joinedAt: Date;
  leftAt?: Date;
  metadata: Record<string, any>;
}
