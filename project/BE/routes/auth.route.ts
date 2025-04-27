import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";

const router = express.Router();

router.use("/register", registerUser);
router.use("/login", loginUser);

export default router;
