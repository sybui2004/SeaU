import mongoose, { Document } from "mongoose";
type NotificationType =
  | "like"
  | "comment"
  | "friend_request"
  | "accept_request"
  | "message"
  | "friend_post"
  | "system";

type ReferenceType =
  | "post"
  | "comment"
  | "user"
  | "friendship"
  | "message"
  | "conversation";

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: NotificationType;
  content: string;
  reference: mongoose.Types.ObjectId;
  referenceType: ReferenceType;
  isRead: boolean;
  isDeleted: boolean;
  metadata: Record<string, any>;
  priority?: "low" | "medium" | "high";
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
