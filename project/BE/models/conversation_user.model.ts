import mongoose from "mongoose";

const conversationUserSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      required: true,
      default: "member",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    leftAt: {
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

conversationUserSchema.index({ conversation: 1, user: 1 }, { unique: true });
conversationUserSchema.index({ user: 1, isDeleted: 1 });
conversationUserSchema.index({ conversation: 1, role: 1 });

const ConversationUser = mongoose.model(
  "ConversationUser",
  conversationUserSchema
);

export default ConversationUser;
