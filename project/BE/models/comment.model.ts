import mongoose from "mongoose";
import { IComment } from "../interfaces/comment.interface";

const commentSchema = new mongoose.Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
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

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });
commentSchema.index({ parent: 1, createdAt: -1 });

commentSchema.virtual("likesCount").get(function () {
  return this.likes?.length || 0;
});

commentSchema.virtual("repliesCount").get(function () {
  return this.replies?.length || 0;
});

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
