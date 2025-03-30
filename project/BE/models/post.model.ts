import mongoose from "mongoose";
import { IPost } from "../interfaces/post.interface";

const postSchema = new mongoose.Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: function (v: string[]) {
          return v.length <= 10; // Maximum 10 tags
        },
        message: "Post can have at most 10 tags",
      },
    },
    bannerImage: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      required: true,
      default: "public",
    },
    featured: {
      type: Boolean,
      required: true,
      default: false,
    },
    category: {
      type: String,
      required: true,
      enum: ["technology", "lifestyle", "travel", "food", "other"],
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      required: true,
      default: "draft",
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    readingTime: {
      type: Number,
      required: true,
      min: 1,
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

postSchema.index({ title: "text", content: "text", tags: "text" });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ visibility: 1 });
postSchema.index({ featured: 1 });

postSchema.virtual("engagement").get(function (this: IPost) {
  return {
    likesCount: this.likes?.length || 0,
    commentsCount: this.comments?.length || 0,
    views: this.views,
  };
});

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
