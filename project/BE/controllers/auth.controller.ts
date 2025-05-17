import User from "../models/user.model";
import { Request, Response } from "express";
import { responseUtils } from "../utils/response.utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_KEY || "MERN";

// Register
export const registerUser = async (req: Request, res: Response) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPass;
  const newUser = new User(req.body);
  const { username } = req.body;
  try {
    const oldUser = await User.findOne({ username });
    if (oldUser) {
      res.status(400).json("Username is already registered");
      return;
    }
    const user = await newUser.save();
    const token = jwt.sign({ username: user.username, id: user._id }, secret, {
      expiresIn: "1h",
    });
    responseUtils.success(res, { user, token });
  } catch (error) {
    responseUtils.error(res, "Registration failed. Please try again.");
  }
};

// Login
export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      res.status(404).json("User does not exists");
      return;
    }
    const validity = await bcrypt.compare(password, user.password);
    if (!validity) {
      res.status(400).json("Wrong password");
      return;
    } else {
      const token = jwt.sign(
        { username: user.username, id: user._id },
        secret,
        {
          expiresIn: "12h",
        }
      );
      responseUtils.success(res, { user, token });
    }
  } catch (error) {
    responseUtils.error(res, "Login failed. Please try again.");
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log("Admin login attempt:", { username });

  try {
    const user = await User.findOne({ username: username });
    console.log("User found:", !!user);

    if (!user) {
      res.status(404).json("User does not exist");
      return;
    }

    console.log("Is user admin:", user.isAdmin);
    if (!user.isAdmin) {
      res.status(403).json("Access denied. Not an admin account.");
      return;
    }

    const validity = await bcrypt.compare(password, user.password);
    if (!validity) {
      res.status(400).json("Wrong password");
      return;
    }

    const token = jwt.sign(
      {
        username: user.username,
        id: user._id,
        isAdmin: user.isAdmin,
      },
      secret,
      {
        expiresIn: "12h",
      }
    );

    responseUtils.success(res, { user, token });
  } catch (error) {
    console.error("Admin login error:", error);
    responseUtils.error(res, "Admin login failed. Please try again.");
  }
};
