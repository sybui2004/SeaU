import mongoose from "mongoose";

type FriendshipStatus = "pending" | "accepted" | "declined" | "blocked";
type RelationType = "friend" | "best_friend" | "dating" | "married";

export interface IFriendship extends Document {
  requester: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  status: FriendshipStatus;
  type: RelationType;
  isDeleted: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
