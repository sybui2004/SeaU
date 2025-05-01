import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model";
dotenv.config();

// Kết nối database - Sử dụng MONGO_URI từ .env
const MONGO_URI = process.env.MONGO_URI;
console.log("Connecting to MongoDB with URI:", MONGO_URI);

mongoose
  .connect(MONGO_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Liệt kê tất cả người dùng
async function listAllUsers() {
  try {
    // Tìm tất cả người dùng
    const users = await User.find({});

    console.log(`Tìm thấy ${users.length} người dùng trong database:`);

    users.forEach((user, index) => {
      console.log(`\nUser #${index + 1}:`);
      console.log(`ID: ${user._id}`);
      console.log(`Username: ${user.username}`);
      console.log(`Fullname: ${user.fullname}`);
      console.log(`isAdmin: ${user.isAdmin || false}`);
    });

    // Tìm user với username "admin"
    const adminUser = await User.findOne({ username: "admin" });

    if (adminUser) {
      console.log("\n===== ADMIN USER DETAILS =====");
      console.log(`ID: ${adminUser._id}`);
      console.log(`Username: ${adminUser.username}`);
      console.log(`Fullname: ${adminUser.fullname}`);
      console.log(`isAdmin: ${adminUser.isAdmin || false}`);
    } else {
      console.log("\nKhông tìm thấy tài khoản với username 'admin'");
    }
  } catch (error) {
    console.error("Lỗi khi liệt kê người dùng:", error);
  } finally {
    // Đóng kết nối database
    mongoose.connection.close();
  }
}

// Chạy hàm liệt kê người dùng
listAllUsers();
