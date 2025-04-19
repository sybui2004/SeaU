import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: false,
    },
    // tags: {
    //   type: [String],
    //   required: true,
    //   validate: {
    //     validator: function (v: string[]) {
    //       return v.length <= 10; // Maximum 10 tags
    //     },
    //     message: "Post can have at most 10 tags",
    //   },
    // },
    image: {
      type: String,
    },
    // visibility: {
    //   type: String,
    //   enum: ["public", "private"],
    //   required: true,
    //   default: "public",
    // },
    // featured: {
    //   type: Boolean,
    //   required: true,
    //   default: false,
    // },
    // status: {
    //   type: String,
    //   enum: ["draft", "published", "archived"],
    //   required: true,
    //   default: "draft",
    // },
    // isDeleted: {
    //   type: Boolean,
    //   required: true,
    //   default: false,
    // },

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
    // views: {
    //   type: Number,
    //   default: 0,
    //   min: 0,
    // },
    // readingTime: {
    //   type: Number,
    //   required: true,
    //   min: 1,
    // },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// postSchema.index({ title: "text", content: "text", tags: "text" });
// postSchema.index({ author: 1, createdAt: -1 });
// postSchema.index({ category: 1, createdAt: -1 });
// postSchema.index({ status: 1, createdAt: -1 });
// postSchema.index({ visibility: 1 });
// postSchema.index({ featured: 1 });

// postSchema.virtual("engagement").get(function (this: IPost) {
//   return {
//     likesCount: this.likes?.length || 0,
//     commentsCount: this.comments?.length || 0,
//     views: this.views,
//   };
// });

const Post = mongoose.model("Post", postSchema);

export default Post;
