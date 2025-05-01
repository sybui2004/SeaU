import { Request, Response, NextFunction, RequestHandler } from "express";

const wrap = (
  controller: (req: Request, res: Response) => Promise<any>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(controller(req, res))
      .then(() => {
        if (!res.headersSent) {
          return next();
        }
      })
      .catch(next);
  };
};

export default wrap;
