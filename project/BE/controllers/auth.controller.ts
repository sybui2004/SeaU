import { CreateUserRequest, IUser } from "../interfaces/user.interface";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";

// register user
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

export const registerUser = async (
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

// login user
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const validity = await bcrypt.compare(password, user.password);
      validity
        ? res.status(200).json({
            success: true,
            message: "Logged in successfully",
          })
        : res.status(400).json({
            success: false,
            message: "Invalid password",
          });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error log in",
      error: error.message,
    });
  }
};
