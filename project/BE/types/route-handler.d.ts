import { Response, Request, NextFunction } from "express";

declare module "express-serve-static-core" {
  export interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): any;
  }
}
