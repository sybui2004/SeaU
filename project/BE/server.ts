import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { connectDB } from "./config/db";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
import postRoutes from "./routes/post.route";
import uploadRoutes from "./routes/upload.route";
import conversationRoutes from "./routes/conversation.route";
import messageRoutes from "./routes/message.route";
import commentRoutes from "./routes/comment.route";
import searchRoute from "./routes/search.route";

const app = express();

app.use(express.static("public"));
app.use("/images", express.static("images"));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const port = process.env.PORT || 3000;
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoURI = process.env.MONGO_URI;
console.log(mongoURI);

// Mount routes
app.use(express.json());
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/chat", conversationRoutes);
app.use("/message", messageRoutes);
app.use("/comment", commentRoutes);
app.use("/upload", uploadRoutes);
app.use("/search", searchRoute);
app.use("/conversation", conversationRoutes);

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
