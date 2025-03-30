import express, { Request, Response } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";

const router = express.Router();
router.get("/", async (req: Request, res: Response) => {
  res.send("Hello World");
});
router.post("/register", registerUser);
router.post("/login", loginUser);
export default router;
