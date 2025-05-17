import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      default: "",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAvatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ members: 1 });
conversationSchema.index({ lastMessage: 1 });
conversationSchema.index({ isGroupChat: 1 });
conversationSchema.index({ groupAdmin: 1 });
conversationSchema.index({ updatedAt: -1 });
conversationSchema.index({ members: 1, updatedAt: -1 });
conversationSchema.index({ groupName: "text" });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
