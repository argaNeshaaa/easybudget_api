import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { createOtpModel, findOtpModel, resetPasswordModel } from "../models/authModels.js";
import { findAllUsersModels } from "../models/usersModels.js"; // Reuse find user by email logic if exist
import db from "../config/db.js"; // Direct query for checking email if needed

// Konfigurasi Email (Ganti dengan kredensial SMTP Anda)
const transporter = nodemailer.createTransport({
  service: "gmail", // Atau SMTP hosting lain
  auth: {
    user: process.env.EMAIL_USER, // Email pengirim
    pass: process.env.EMAIL_PASS, // App Password (bukan password login gmail biasa)
  },
});

export const requestOtpService = async (email) => {
  // 1. Cek apakah email terdaftar
  const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  if (users.length === 0) {
    throw new Error("Email tidak terdaftar");
  }

  // 2. Generate OTP 6 digit
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Expire 15 menit

  // 3. Simpan ke DB
  await createOtpModel(email, otp, expiresAt);

  // 4. Kirim Email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Password EasyBudget - Kode OTP",
    text: `Kode OTP Anda adalah: ${otp}. Kode ini berlaku selama 15 menit.`,
    html: `<h3>Reset Password EasyBudget</h3><p>Gunakan kode di bawah ini untuk mereset kata sandi Anda:</p><h1 style="color:blue">${otp}</h1><p>Kode berlaku 15 menit.</p>`
  };

  await transporter.sendMail(mailOptions);
  return { message: "OTP sent to email" };
};

export const verifyOtpService = async (email, otp) => {
  const validOtp = await findOtpModel(email, otp);
  if (!validOtp) {
    throw new Error("Kode OTP salah atau kadaluarsa");
  }
  return { message: "OTP Valid" };
};

export const resetPasswordService = async (email, otp, newPassword) => {
  // Verifikasi ulang OTP untuk keamanan ganda
  const validOtp = await findOtpModel(email, otp);
  if (!validOtp) {
    throw new Error("Sesi reset tidak valid");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await resetPasswordModel(email, hashedPassword);
  
  return { message: "Password berhasil diubah" };
};