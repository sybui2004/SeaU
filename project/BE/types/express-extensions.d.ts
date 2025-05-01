/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

declare module "express-serve-static-core" {
  export interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): any;
  }

  // Mở rộng response để chấp nhận cả Promise return
  export interface Response {
    [key: string]: any;
  }
}
