import express, { Request, Response } from "express";
import { searchController } from "../controllers/search.controller";
import authMiddleWare from "../middleware/auth.middleware";

const router = express.Router();

// Route search both users and posts
router.get("/", authMiddleWare, (req: Request, res: Response) => {
  searchController.search(req, res);
});

// Route search only users
router.get("/users", authMiddleWare, (req: Request, res: Response) => {
  searchController.searchUsers(req, res);
});

export default router;
