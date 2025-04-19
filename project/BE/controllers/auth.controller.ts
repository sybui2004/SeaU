import User from "../models/user.model";
import { Request, Response } from "express";
import { responseUtils } from "../utils/response.utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_KEY || "",
      {
        expiresIn: "1h",
      }
    );
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
        process.env.JWT_KEY || "",
        {
          expiresIn: "1h",
        }
      );
      responseUtils.success(res, { user, token });
    }
  } catch (error) {
    responseUtils.error(res, "Login failed. Please try again.");
  }
};
