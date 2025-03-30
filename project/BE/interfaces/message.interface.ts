import mongoose, { Document } from "mongoose";
type MessageType = "text" | "image" | "video" | "audio" | "file" | "share_post";

interface IMediaContent {
  url?: string;
  thumbnail?: string;
  duration?: number; // for audio/video
  size?: number; // for files
  mimeType?: string;
}

interface IReadReceipt {
  user: mongoose.Types.ObjectId;
  readAt: Date;
}

interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  type: MessageType;
  media?: IMediaContent;
  sharedPost?: mongoose.Types.ObjectId;
  isDeleted: boolean;
  deletedFor: mongoose.Types.ObjectId[];
  readBy: IReadReceipt[];
  replyTo?: mongoose.Types.ObjectId;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export { IMessage, IMediaContent, IReadReceipt, MessageType };
