import { Request, Response, NextFunction } from "express";

interface AsyncController {
  (req: Request, res: Response, next?: NextFunction): Promise<any>;
}

export const asyncHandler = (fn: AsyncController) => {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res)).catch(next);
  };
};
