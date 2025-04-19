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
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000, // Giới hạn độ dài tin nhắn
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "file", "share_post"],
      required: true,
      default: "text",
    },
    media: {
      url: String,
      thumbnail: String,
      duration: Number,
      size: Number,
      mimeType: String,
    },
    sharedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
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

messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ "readBy.user": 1 });
messageSchema.index({ type: 1 });
messageSchema.index({ isDeleted: 1 });

// messageSchema.virtual("isUnread").get(function (this: IMessage) {
//   return this.readBy.length === 0;
// });

const Message = mongoose.model("Message", messageSchema);

export default Message;
