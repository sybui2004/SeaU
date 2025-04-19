import mongoose, { Document } from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "love", "haha", "sad", "angry"],
      required: true,
      default: "like",
    },
    isDeleted: {
      type: Boolean,
      default: false,
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

likeSchema.index({ user: 1, post: 1 }, { unique: true });
likeSchema.index({ post: 1, createdAt: -1 });
likeSchema.index({ user: 1, createdAt: -1 });
likeSchema.index({ type: 1 });
likeSchema.index({ isDeleted: 1 });

// likeSchema.virtual("reactionAge").get(function (this: ILike) {
//   return Date.now() - this.createdAt.getTime();
// });

// likeSchema.pre("save", async function (this: ILike, next) {
//   if (this.isNew) {
//     await this.model("Like").deleteOne({
//       user: this.user,
//       post: this.post,
//       _id: { $ne: this._id },
//     });
//   }
//   next();
// });

const Like = mongoose.model("Like", likeSchema);

export default Like;
