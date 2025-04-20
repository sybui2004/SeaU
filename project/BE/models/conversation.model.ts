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

// conversationSchema.index({ "members.user": 1 });
// conversationSchema.index({ type: 1, createdAt: -1 });
// conversationSchema.index({ lastMessage: 1 });

// conversationSchema
//   .virtual("unreadCount")
//   .get(function (this: IConversation & { lastMessage?: { createdAt?: Date } }) {
//     return this.members.reduce((count, member) => {
//       const messageDate = this.lastMessage?.createdAt;
//       if (messageDate && member.lastRead < messageDate) {
//         return count + 1;
//       }
//       return count;
//     }, 0);
//   });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
