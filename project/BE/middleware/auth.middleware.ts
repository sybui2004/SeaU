import { Request, Response, NextFunction, RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

interface DecodedToken {
  id: string;
}

const secret = process.env.JWT_KEY || "MERN";

const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Authentication token required" });
      return;
    }

    try {
      const decoded = jwt.verify(token, secret) as DecodedToken;
      req.body.userId = decoded.id;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid authentication token" });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: "Server authentication error" });
    return;
  }
};

export default authMiddleware;
