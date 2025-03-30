import mongoose, { Document } from "mongoose";
type ConversationType = "group" | "private";
type Role = "admin" | "member";
export interface IConversation extends Document {
  title?: string;
  type: ConversationType;
  members: Array<{
    user: mongoose.Types.ObjectId;
    role: Role;
    joinedAt: Date;
    lastRead: Date;
  }>;
  lastMessage?: mongoose.Types.ObjectId;
  isDeleted: boolean;
  deletedFor: Array<{
    user: mongoose.Types.ObjectId;
    deletedAt: Date;
  }>;
  metadata: Record<string, any>;
  unreadCount: number;
}
