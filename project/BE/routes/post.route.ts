import express from "express";
import {
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  getTimelinePost,
  getUserPosts,
  getAllPostsForAdmin,
} from "../controllers/post.controller";
import authMiddleware from "../middleware/auth.middleware";
import wrap from "./wrap";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Make sure upload directory exists
const uploadDir = path.join(__dirname, "../public/images");
if (!fs.existsSync(uploadDir)) {
  console.log(`Creating upload directory: ${uploadDir}`);
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Upload destination path:", uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    console.log("Original filename:", file.originalname);
    const filename = `post-${Date.now()}${path.extname(file.originalname)}`;
    console.log("Generated filename:", filename);
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    console.log("File received:", file);
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed: jpeg, jpg, png, gif"));
  },
});

const handleFileUpload = (req, res, next) => {
  upload.single("image")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
    } else if (err) {
      console.error("Unknown upload error:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    if (req.file) {
      console.log("File uploaded successfully:", req.file);
      req.body.image = `/images/${req.file.filename}`;
    }

    next();
  });
};

// Admin route to get all posts
router.get("/admin", wrap(getAllPostsForAdmin));

// Get user posts
router.get("/user/:id", wrap(getUserPosts));

// Get timeline posts
router.get("/:id/timeline", wrap(getTimelinePost));

// Get post by id
router.get("/:id", wrap(getPost));

router.use(authMiddleware);

// Create post
router.post("/", handleFileUpload, wrap(createPost));

// Update post
router.put("/:id", wrap(updatePost));

// Update post with image
router.put(
  "/:id/with-image",
  handleFileUpload,
  wrap(async (req, res) => {
    console.log("Updating post with image", req.params.id);
    console.log("Request body:", req.body);
    console.log("File:", req.file);

    await updatePost(req, res);
  })
);

// Test upload route
// router.post("/test-upload", (req, res) => {
//   console.log("Testing file upload route");
//   handleFileUpload(req, res, (err) => {
//     if (err) {
//       console.error("Error in test upload:", err);
//       return res.status(500).json({ success: false, message: err.message });
//     }

//     console.log("Test upload request body:", req.body);
//     console.log("Test upload file:", req.file);

//     if (req.file) {
//       return res.status(200).json({
//         success: true,
//         message: "File uploaded successfully!",
//         file: req.file,
//         imagePath: `/images/${req.file.filename}`,
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "No file was uploaded or file field name is incorrect",
//       });
//     }
//   });
// });

// Delete post
router.delete("/:id", wrap(deletePost));

// Like post
router.put("/:id/like", wrap(likePost));

export default router;
