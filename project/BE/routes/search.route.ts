import express, { Request, Response } from "express";
import { searchController } from "../controllers/search.controller";

const router = express.Router();

// Route search both users and posts
router.get("/", (req: Request, res: Response) => {
  searchController.search(req, res);
});

// Route search only users
router.get("/users", (req: Request, res: Response) => {
  searchController.searchUsers(req, res);
});

export default router;
