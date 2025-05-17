import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: false,
      default: null,
    },
    dob: {
      type: Date,
      required: false,
      default: null,
    },
    phone: {
      type: String,
      required: false,
      default: null,
    },
    address: {
      type: String,
      required: false,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String,
    },
    occupation: {
      type: String,
      required: false,
      default: null,
    },
    language: {
      type: String,
      required: false,
      default: "English",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    friends: {
      type: Array,
      default: [],
    },
    sentFriendRequests: {
      type: Array,
      default: [],
    },
    receivedFriendRequests: {
      type: Array,
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 });
userSchema.index({ fullname: "text" });
userSchema.index({ isAdmin: 1 });
userSchema.index({ isDeleted: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ isDeleted: 1, createdAt: -1 });

const User = mongoose.model("User", userSchema);

export default User;
