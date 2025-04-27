import express, { Request, Response } from "express";
const router = express.Router();
import multer from "multer";
import authMiddleWare from "../middleware/auth.middleware";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/",
  authMiddleWare,
  upload.single("file"),
  (req: Request, res: Response): void => {
    try {
      res.status(200).json("File uploaded successfully");
    } catch (error) {
      console.error(error);
      res.status(500).json("Error uploading file");
    }
  }
);

export default router;
