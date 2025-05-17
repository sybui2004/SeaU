import express from "express";
import { searchController } from "../controllers/search.controller";
import wrap from "./wrap";

const router = express.Router();

// Route search both users and posts
router.get("/", wrap(searchController.search));

// Route search only users
router.get("/users", wrap(searchController.searchUsers));

export default router;
