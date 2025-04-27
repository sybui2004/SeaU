import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
dotenv.config();

interface DecodedToken {
  id: string;
}

const secret = process.env.JWT_KEY || "fallback_secret";
console.log("Middleware using secret key:", secret);

const authMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      req.body.isAuthenticated = false;
      return next();
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      req.body.isAuthenticated = false;
      return next();
    }

    try {
      const decoded = jwt.decode(token);

      req.body._id = (decoded as any).id;
      req.body.isAuthenticated = true;
      next();
    } catch (error) {
      console.log("Token verification error:", error);
      req.body.isAuthenticated = false;
      next();
    }
  } catch (error) {
    console.log("Auth middleware error:", error);
    req.body.isAuthenticated = false;
    next();
  }
};

export default authMiddleWare;
