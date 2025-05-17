import mongoose from "mongoose";
import User from "../models/user.model";

const MONGO_URI =
  "mongodb+srv://symerline2004:ifitmEJbnruYjHVr@cluster0.asmkc.mongodb.net/SeaU?retryWrites=true&w=majority&appName=Cluster0";
console.log("Connecting to MongoDB...");

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function updateAdminProfile() {
  try {
    const adminUser = await User.findOne({ username: "admin" });

    if (!adminUser) {
      console.log("Không tìm thấy tài khoản admin");
      return;
    }

    console.log("Tìm thấy tài khoản admin:", adminUser._id);

    const updatedUser = await User.findByIdAndUpdate(
      adminUser._id,
      {
        $set: {
          email: "admin@seau.com",
          profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
          gender: "male",
          dob: new Date("1990-01-01"),
          phone: "0123456789",
          address: "Admin Office",
          occupation: "System Administrator",
          language: "Vietnamese",
          friends: [],
          sentFriendRequests: [],
          receivedFriendRequests: [],
        },
      },
      { new: true }
    );

    console.log("Đã cập nhật thông tin profile admin:");
    console.log(`ID: ${updatedUser?._id}`);
    console.log(`Username: ${updatedUser?.username}`);
    console.log(`Email: ${updatedUser?.email}`);
    console.log(`Profile Picture: ${updatedUser?.profilePic}`);
  } catch (error) {
    console.error("Error updating admin profile:", error);
  } finally {
    setTimeout(() => {
      mongoose.connection.close();
      console.log("Closed MongoDB connection");
    }, 1000);
  }
}

updateAdminProfile();
