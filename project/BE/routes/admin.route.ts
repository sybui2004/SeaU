import express from "express";
import { adminController } from "../controllers/admin.controller";
import authMiddleware from "../middleware/auth.middleware";
import adminMiddleware from "../middleware/admin.middleware";
import wrap from "./wrap";
import multer from "multer";
import path from "path";
import { getAllConversationsForAdmin } from "../controllers/conversation.controller";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "BE/public/images");
  },
  filename: function (req, file, cb) {
    cb(null, `user-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed"));
  },
});

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/users", wrap(adminController.getAllUsers));

router.get("/users/:userId", wrap(adminController.getUserById));

router.put(
  "/users/:userId",
  upload.single("profilePic"),
  wrap(adminController.updateUser)
);

router.delete("/users/:userId", wrap(adminController.deleteUser));

router.get("/stats", wrap(adminController.getDashboardStats));

// Conversations routes
router.get("/conversations", wrap(getAllConversationsForAdmin));

export default router;
