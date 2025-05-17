import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.model";

const MONGO_URI =
  "mongodb+srv://symerline2004:ifitmEJbnruYjHVr@cluster0.asmkc.mongodb.net/SeaU?retryWrites=true&w=majority&appName=Cluster0";
console.log("Connecting to MongoDB...");
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function createAdminAccount() {
  try {
    const existingAdmin = await User.findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("Admin account exists.");

      const salt = await bcrypt.genSalt(10);
      const newPassword = "admin123";
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const updatedUser = await User.findOneAndUpdate(
        { username: "admin" },
        {
          $set: {
            password: hashedPassword,
            isAdmin: true,
          },
        },
        { new: true }
      );

      console.log("Admin account updated:");
      console.log(`ID: ${updatedUser?._id}`);
      console.log(`Username: admin`);
      console.log(`Password: admin123`);
      console.log(`isAdmin: ${updatedUser?.isAdmin}`);
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new User({
      username: "admin",
      password: hashedPassword,
      fullname: "Admin User",
      isAdmin: true,
    });

    const savedUser = await newAdmin.save();

    console.log("New admin account created:");
    console.log(`ID: ${savedUser._id}`);
    console.log(`Username: admin`);
    console.log(`Password: admin123`);
    console.log(`isAdmin: ${savedUser.isAdmin}`);
  } catch (error) {
    console.error("Error creating admin account:", error);
  } finally {
    setTimeout(() => {
      mongoose.connection.close();
      console.log("Closed MongoDB connection");
    }, 1000);
  }
}

createAdminAccount();
