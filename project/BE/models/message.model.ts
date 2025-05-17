import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    originalText: {
      type: String,
    },
    fileType: {
      type: String,
      enum: ["image", "audio", "video", "other", null],
      default: null,
    },
    fileData: {
      type: String,
    },
    fileName: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    isReadBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ isDeleted: 1 });
messageSchema.index({ text: "text" });
messageSchema.index({ conversationId: 1, senderId: 1, createdAt: -1 });
messageSchema.index({ fileType: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
