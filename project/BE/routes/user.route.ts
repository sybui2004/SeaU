import { Router, Request, Response } from "express";
import {
  createUser,
  getUsers,
  validateCreateUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

const router = Router();

// Routes
router.get("/", (_req: Request, res: Response): void => {
  res.send("<h1>Welcome to User API</h1>");
});

// Create user
router.post("/users", validateCreateUser, createUser);

// Get all users with pagination and filtering
router.get("/users", getUsers);

// Get user by id
router.get("/users/:id", getUserById);

// Update user
router.put("/users/:id", updateUser);

// Delete user (soft delete)
router.delete("/users/:id", deleteUser);

export default router;
