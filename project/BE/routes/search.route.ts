import express from "express";
import { searchController } from "../controllers/search.controller";
import authMiddleware from "../middleware/auth.middleware";
import wrap from "./wrap";

const router = express.Router();

// Route search both users and posts
router.get("/", authMiddleware, wrap(searchController.search));

// Route search only users
router.get("/users", authMiddleware, wrap(searchController.searchUsers));

export default router;
