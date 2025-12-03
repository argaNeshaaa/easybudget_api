import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { requestOtpService, verifyOtpService, resetPasswordService } from "../services/authServices.js";
let context;
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [result] = await db.query(
      `SELECT users.*, roles.name AS role_name
       FROM users
       JOIN roles ON users.role_id = roles.id
       WHERE users.email = ?`,
      [email]
    );

    if (result.length === 0) {
      return next(ApiError.notFound("Email"));
    }

    const user = result[0];

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(ApiError.unauthorized("Password"));
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role_name,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;
    await requestOtpService(email);
    res.status(200).json({ status: "success", message: "OTP telah dikirim ke email Anda" });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

export const verifyOtpController = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    await verifyOtpService(email, otp);
    res.status(200).json({ status: "success", message: "OTP Valid" });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    await resetPasswordService(email, otp, newPassword);
    res.status(200).json({ status: "success", message: "Password berhasil diubah. Silakan login." });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

