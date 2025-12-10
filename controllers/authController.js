import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../config/db.js";
import crypto from "crypto";
import { sendEmail } from "../utils/emailService.js";
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

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    // A. Cek apakah email terdaftar di tabel users
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      // Return sukses palsu agar email tidak bisa discraping
      return res.status(200).json({ message: "Jika email valid, kode OTP telah dikirim." });
    }

    // B. Generate OTP 6 Digit Angka
    // (crypto.randomInt tersedia di Node.js v14.10+)
    const otp = crypto.randomInt(100000, 999999).toString();

    // C. Set Expired (Misal: 15 Menit dari sekarang)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

    // D. Simpan ke tabel 'password_resets'
    // Kita hapus dulu OTP lama milik email ini agar tidak numpuk (opsional tapi disarankan)
    await db.query("DELETE FROM password_resets WHERE email = ?", [email]);

    await db.query(
      "INSERT INTO password_resets (email, otp_code, expires_at, created_at) VALUES (?, ?, ?, NOW())",
      [email, otp, expiresAt]
    );

    // E. Kirim Email
    const emailHtml = `
      <div style="font-family: sans-serif; text-align: center;">
        <h2>Reset Password Easy Budget</h2>
        <p>Gunakan kode OTP berikut untuk mereset kata sandi Anda:</p>
        <h1 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 5px;">${otp}</h1>
        <p>Kode ini berlaku selama 15 menit.</p>
        <p>JANGAN BERIKAN KODE INI KEPADA SIAPAPUN.</p>
      </div>
    `;

    await sendEmail(email, "Kode OTP Reset Password", emailHtml);

    res.json({ message: "Kode OTP telah dikirim ke email Anda." });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
};


// --- 2. VERIFY OTP (Cek apakah OTP valid) ---
// Endpoint ini dipanggil saat user klik "Verifikasi" di frontend sebelum input password baru
export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // A. Cari OTP di database
    const [rows] = await db.query(
      "SELECT * FROM password_resets WHERE email = ? AND otp_code = ? AND expires_at > NOW()",
      [email, otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Kode OTP salah atau sudah kadaluarsa." });
    }

    // Jika ketemu, berarti valid
    res.status(200).json({ message: "OTP Valid. Silakan buat password baru." });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Gagal memverifikasi OTP." });
  }
};


// --- 3. RESET PASSWORD (Simpan Password Baru) ---
export const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // A. Validasi ulang OTP (PENTING: Biar gak ditembak API langsung tanpa OTP)
    const [rows] = await db.query(
      "SELECT * FROM password_resets WHERE email = ? AND otp_code = ? AND expires_at > NOW()",
      [email, otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Sesi tidak valid atau OTP kadaluarsa." });
    }

    // B. Hash Password Baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // C. Update Password User di tabel 'users'
    await db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);

    // D. Hapus OTP agar tidak bisa dipakai lagi (Clean up)
    await db.query("DELETE FROM password_resets WHERE email = ?", [email]);

    res.json({ message: "Password berhasil diubah! Silakan login." });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Gagal mereset password." });
  }
};