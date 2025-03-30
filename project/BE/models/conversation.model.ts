import mongoose from "mongoose";
import { IConversation } from "../interfaces/conversation.interface";

const conversationSchema = new mongoose.Schema<IConversation>(
  {
    title: {
      type: String,
      required: function (this: IConversation) {
        return this.type === "group";
      },
    },
    type: {
      type: String,
      enum: ["group", "private"],
      required: true,
      default: "private",
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        lastRead: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedFor: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        deletedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ "members.user": 1 });
conversationSchema.index({ type: 1, createdAt: -1 });
conversationSchema.index({ lastMessage: 1 });

conversationSchema
  .virtual("unreadCount")
  .get(function (this: IConversation & { lastMessage?: { createdAt?: Date } }) {
    return this.members.reduce((count, member) => {
      const messageDate = this.lastMessage?.createdAt;
      if (messageDate && member.lastRead < messageDate) {
        return count + 1;
      }
      return count;
    }, 0);
  });

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);

export default Conversation;
