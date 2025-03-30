import {
  CreateUserRequest,
  IUser,
  UpdateUserRequest,
} from "../interfaces/user.interface";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";

export const validateCreateUser = (
  req: Request<{}, {}, CreateUserRequest>,
  res: Response,
  next: NextFunction
): void => {
  const { firstName, lastName, email, password, gender, profilePic } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !gender ||
    !profilePic
  ) {
    res.status(400).json({
      success: false,
      message: "Please provide all required fields",
      missingFields: {
        firstName: !firstName,
        lastName: !lastName,
        email: !email,
        password: !password,
        gender: !gender,
        profilePic: !profilePic,
      },
    });
    return;
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
    return;
  }

  // Password strength validation
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      success: false,
      message:
        "Password must have at least 6 characters, an uppercase letter, a number, and a special character",
    });
    return;
  }

  next();
};

export const createUser = async (
  req: Request<{}, {}, CreateUserRequest>,
  res: Response
): Promise<void> => {
  try {
    const { password, ...userData } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ ...userData, password: hashedPassword });
    const savedUser = await newUser.save();
    const userResponse = savedUser.toObject() as Partial<IUser>;
    const { password: _, metadata, ...safeUserResponse } = userResponse;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: safeUserResponse,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: "Email already exists",
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, role, search } = req.query;

    const query: any = {};

    // Apply filters
    if (status) query.status = status;
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password -metadata")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 })
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -metadata"
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    if (error.name === "CastError") {
      res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

export const updateUser = async (
  req: Request<{ id: string }, {}, UpdateUserRequest>,
  res: Response
): Promise<void> => {
  try {
    const updateData = req.body;

    // Prevent updating sensitive fields
    delete updateData.password;
    delete updateData.email;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -metadata");

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    if (error.name === "CastError") {
      res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "inactive", isDeleted: true } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    if (error.name === "CastError") {
      res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};
