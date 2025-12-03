// auth.js
import express from "express";
import jwt from "jsonwebtoken";
import passport from "../config/google.js"; // Pastikan path benar
import { loginUser, forgotPasswordController, verifyOtpController, resetPasswordController } from "../controllers/authController.js"; // Uncomment jika ada

const router = express.Router();

router.post("/login", loginUser);

// 1. Trigger Google Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false }) // Tambahkan session: false
);

// 2. Callback dari Google
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }), // PENTING: session: false
  (req, res) => {
    // Karena session: false, req.user tetap tersedia di sini berkat passport
    const token = jwt.sign(
      { user_id: req.user.user_id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Redirect ke frontend dengan token
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/success?token=${token}`  
    );
  }
);

router.post("/forgot-password", forgotPasswordController);
router.post("/verify-otp", verifyOtpController);
router.post("/reset-password", resetPasswordController);

export default router;