import { Document, Types } from "mongoose";

export interface IMessageNotification extends Document {
  recipient: Types.ObjectId;
  message: Types.ObjectId;
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  isRead: boolean;
  isDeleted: boolean;
  readAt?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMessageNotificationRequest {
  recipient: string;
  message: string;
  conversation: string;
  sender: string;
  content: string;
}

export interface UpdateMessageNotificationRequest {
  isRead?: boolean;
  isDeleted?: boolean;
  readAt?: Date;
  metadata?: Record<string, any>;
}
