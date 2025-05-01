import express from "express";
import {
  loginUser,
  registerUser,
  loginAdmin,
} from "../controllers/auth.controller";
import wrap from "./wrap";

const router = express.Router();

router.post("/register", wrap(registerUser));
router.post("/login", wrap(loginUser));
router.post("/admin/login", wrap(loginAdmin));

export default router;
