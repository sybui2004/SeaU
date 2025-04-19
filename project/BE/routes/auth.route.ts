import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", (req, res) => registerUser(req, res));
router.post("/login", (req, res) => loginUser(req, res));

export default router;
