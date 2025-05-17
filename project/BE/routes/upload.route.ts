import express, { Request, Response } from "express";
import multer from "multer";
import authMiddleware from "../middleware/auth.middleware";
import path from "path";
import fs from "fs";

const router = express.Router();

const imageDir = path.join(__dirname, "../public/images");
const audioDir = path.join(__dirname, "../public/audio");
const videoDir = path.join(__dirname, "../public/video");

[imageDir, audioDir, videoDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = imageDir;

    if (file.mimetype.startsWith("audio/")) {
      uploadDir = audioDir;
    } else if (file.mimetype.startsWith("video/")) {
      uploadDir = videoDir;
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json("No file uploaded");
        return;
      }

      let fileDir = "images";
      if (file.mimetype.startsWith("audio/")) {
        fileDir = "audio";
      } else if (file.mimetype.startsWith("video/")) {
        fileDir = "video";
      }

      res.status(200).json({
        message: "File uploaded successfully",
        filePath: `/${fileDir}/${file.filename}`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json("Error uploading file");
    }
  }
);

export default router;
