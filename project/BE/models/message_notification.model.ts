import mongoose from "mongoose";
import { IMessageNotification } from "../interfaces/message_notification.interface";

const messageNotificationSchema = new mongoose.Schema<IMessageNotification>(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

messageNotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
messageNotificationSchema.index({ conversation: 1, createdAt: -1 });
messageNotificationSchema.index({ message: 1 }, { unique: true });
messageNotificationSchema.index({ sender: 1, createdAt: -1 });
messageNotificationSchema.index({ isDeleted: 1 });
messageNotificationSchema.index({ createdAt: 1 }, { expires: "30d" });

messageNotificationSchema
  .virtual("timeElapsed")
  .get(function (this: IMessageNotification) {
    return Date.now() - this.createdAt.getTime();
  });

messageNotificationSchema.pre(
  "save",
  function (this: IMessageNotification, next) {
    if (this.isModified("isRead") && this.isRead && !this.readAt) {
      this.readAt = new Date();
    }
    next();
  }
);

const MessageNotification = mongoose.model<IMessageNotification>(
  "MessageNotification",
  messageNotificationSchema
);

export default MessageNotification;
