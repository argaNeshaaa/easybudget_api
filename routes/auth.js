import express from "express";
const jwt = require("jsonwebtoken");
import { loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign(
      { user_id: req.user.user_id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // redirect kembali ke frontend dengan token
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/success?token=${token}`
    );
  }
);
export default router;
