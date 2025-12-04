import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { createOtpModel, findOtpModel, resetPasswordModel } from "../models/authModels.js";
import { findAllUsersModels } from "../models/usersModels.js"; // Reuse find user by email logic if exist
import db from "../config/db.js"; // Direct query for checking email if needed

// Konfigurasi Email (Ganti dengan kredensial SMTP Anda)
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // Host Brevo
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const requestOtpService = async (email) => {
  console.log("Mencari user dengan email:", email); // LOG 1
  const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  if (users.length === 0) {
    throw new Error("Email tidak terdaftar");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 

  console.log("Menyimpan OTP ke database..."); // LOG 2
  await createOtpModel(email, otp, expiresAt);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Password EasyBudget - Kode OTP",
    text: `Kode OTP Anda adalah: ${otp}. Kode ini berlaku selama 15 menit.`,
    html: `<h3>Reset Password EasyBudget</h3><p>Gunakan kode di bawah ini untuk mereset kata sandi Anda:</p><h1 style="color:blue">${otp}</h1><p>Kode berlaku 15 menit.</p>`
  };

  console.log("Mencoba mengirim email..."); // LOG 3
  try {
      await transporter.sendMail(mailOptions);
      console.log("Email terkirim!"); // LOG 4
  } catch (emailError) {
      console.error("Gagal kirim email:", emailError); // LOG ERROR
      throw new Error("Gagal mengirim email. Cek konfigurasi server.");
  }
  
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