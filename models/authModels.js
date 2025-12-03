import db from "../config/db.js";

// Simpan OTP
export const createOtpModel = async (email, otp, expiresAt) => {
  // Hapus OTP lama jika ada
  await db.query("DELETE FROM password_resets WHERE email = ?", [email]);
  
  const query = "INSERT INTO password_resets (email, otp_code, expires_at) VALUES (?, ?, ?)";
  const [result] = await db.query(query, [email, otp, expiresAt]);
  return result;
};

// Cari OTP
export const findOtpModel = async (email, otp) => {
  const query = "SELECT * FROM password_resets WHERE email = ? AND otp_code = ? AND expires_at > NOW()";
  const [rows] = await db.query(query, [email, otp]);
  return rows[0];
};

// Update Password User (Reset)
export const resetPasswordModel = async (email, hashedPassword) => {
  const query = "UPDATE users SET password = ? WHERE email = ?";
  const [result] = await db.query(query, [hashedPassword, email]);
  // Hapus OTP setelah sukses
  await db.query("DELETE FROM password_resets WHERE email = ?", [email]);
  return result;
};