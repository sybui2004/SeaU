import { Response } from "express";

export const responseUtils = {
  success: (res: Response, data: any, status: number = 200) => {
    return res.status(status).json(data);
  },

  error: (res: Response, message: string, status: number = 500) => {
    console.error("API Error:", message);
    return res.status(status).json({ error: message });
  },
};
