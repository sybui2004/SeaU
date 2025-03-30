import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";
import { connectDB } from "./config/db";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";
const app = express();

dotenv.config({ path: path.resolve(__dirname, "../.env") });
const port = process.env.PORT || 3000;
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoURI = process.env.MONGO_URI;
console.log(mongoURI);

// Mount routes
app.use(express.json()); // allow json body
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
