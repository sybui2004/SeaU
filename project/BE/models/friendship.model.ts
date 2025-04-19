import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "blocked"],
      required: true,
      default: "pending",
    },
    type: {
      type: String,
      enum: ["friend", "best_friend", "dating", "married"],
      required: true,
      default: "friend",
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
friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });
friendshipSchema.index({ requester: 1, status: 1 });
friendshipSchema.index({ recipient: 1, status: 1 });
friendshipSchema.index({ createdAt: -1 });
friendshipSchema.index({ type: 1 });
friendshipSchema.index({ isDeleted: 1 });

// friendshipSchema.virtual("friendshipAge").get(function (this: IFriendship) {
//   return Date.now() - this.createdAt.getTime();
// });

// friendshipSchema.virtual("isMutual").get(async function (this: IFriendship) {
//   if (this.status !== "accepted") return false;

//   const mutualFriendship = await mongoose.model("Friendship").findOne({
//     requester: this.recipient,
//     recipient: this.requester,
//     status: "accepted",
//   });

//   return !!mutualFriendship;
// });

// friendshipSchema.pre("save", function (this: IFriendship, next) {
//   if (this.requester.toString() === this.recipient.toString()) {
//     next(new Error("Cannot create friendship with self"));
//   }
//   next();
// });

const Friendship = mongoose.model("Friendship", friendshipSchema);

export default Friendship;
