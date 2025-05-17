import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
console.log("Connecting to MongoDB with URI:", MONGO_URI);

mongoose
  .connect(MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function listAllUsers() {
  try {
    const users = await User.find({});

    console.log(`Found ${users.length} users in the database:`);

    users.forEach((user, index) => {
      console.log(`\nUser #${index + 1}:`);
      console.log(`ID: ${user._id}`);
      console.log(`Username: ${user.username}`);
      console.log(`Fullname: ${user.fullname}`);
      console.log(`isAdmin: ${user.isAdmin || false}`);
    });

    const adminUser = await User.findOne({ username: "admin" });

    if (adminUser) {
      console.log("\n===== ADMIN USER DETAILS =====");
      console.log(`ID: ${adminUser._id}`);
      console.log(`Username: ${adminUser.username}`);
      console.log(`Fullname: ${adminUser.fullname}`);
      console.log(`isAdmin: ${adminUser.isAdmin || false}`);
    } else {
      console.log("\nAdmin account not found");
    }
  } catch (error) {
    console.error("Error listing users:", error);
  } finally {
    mongoose.connection.close();
  }
}

listAllUsers();
