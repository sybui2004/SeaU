import mongoose from "mongoose";
type Language = "en" | "vi" | "ja" | "ko" | "zh";
type Theme = "light" | "dark" | "system";

export interface ISetting extends Document {
  user: mongoose.Types.ObjectId;
  language: Language;
  theme: Theme;
  metadata: Record<string, any>;
}
