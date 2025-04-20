import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { responseUtils } from "../utils/response.utils";

const router = express.Router();

router.use("/register", registerUser);
router.use("/login", loginUser);

export default router;
