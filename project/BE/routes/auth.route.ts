import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { responseUtils } from "../utils/response.utils";

const router = express.Router();

// Use middleware approach to register routes
router.use("/register", registerUser);
router.use("/login", loginUser);

// // Verify password route
// router.use("/verify-password", (req, res) => {
//   const { userId, password } = req.body;

//   User.findById(userId)
//     .then((user) => {
//       if (!user) {
//         return res
//           .status(404)
//           .json({ success: false, message: "User not found" });
//       }

//       bcrypt
//         .compare(password, user.password)
//         .then((isPasswordValid) => {
//           return res.status(200).json({
//             success: isPasswordValid,
//             message: isPasswordValid
//               ? "Password is correct"
//               : "Password is incorrect",
//           });
//         })
//         .catch((err) => {
//           console.error("Error comparing passwords:", err);
//           return res
//             .status(500)
//             .json({ success: false, message: "Server error" });
//         });
//     })
//     .catch((error) => {
//       console.error("Error finding user:", error);
//       return res.status(500).json({ success: false, message: "Server error" });
//     });
// });

export default router;
