import mongoose from "mongoose";
import { IUser } from "../interfaces/user.interface";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
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
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
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
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      required: true,
      default: "active",
    },
    socialMedia: {
      facebook: { type: String, default: null },
      twitter: { type: String, default: null },
      instagram: { type: String, default: null },
      linkedin: { type: String, default: null },
    },
    bio: {
      type: String,
      required: false,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    friends: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ email: 1, status: 1 });
userSchema.index({ firstName: 1, lastName: 1 });

userSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
