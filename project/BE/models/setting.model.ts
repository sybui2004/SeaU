import mongoose from "mongoose";
import { ISetting } from "../interfaces/setting.interface";

const settingSchema = new mongoose.Schema<ISetting>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    language: {
      type: String,
      enum: ["en", "vi", "ja", "ko", "zh"],
      required: true,
      default: "en",
    },
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      required: true,
      default: "system",
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

settingSchema.index({ user: 1 }, { unique: true });

const Setting = mongoose.model<ISetting>("Setting", settingSchema);

export default Setting;
