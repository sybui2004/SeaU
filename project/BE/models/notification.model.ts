import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "like",
        "comment",
        "friend_request",
        "accept_request",
        "message",
        "friend_post",
        "system",
      ],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "referenceType",
      required: true,
    },
    referenceType: {
      type: String,
      enum: [
        "post",
        "comment",
        "user",
        "friendship",
        "message",
        "conversation",
      ],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      },
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1 });
notificationSchema.index({ reference: 1, referenceType: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
notificationSchema.index({ priority: 1, createdAt: -1 });

// notificationSchema.virtual("timeElapsed").get(function (this: INotification) {
//   return Date.now() - this.createdAt.getTime();
// });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
