import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Debugging: Cek apakah variabel terbaca
console.log("SMTP Config:", {
  host: process.env.SMTP_HOST,
  user: process.env.SMTP_USER ? "Terisi" : "KOSONG (Cek .env)",
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true untuk port 465, false untuk lainnya
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false // Membantu jika dijalankan di localhost/firewall ketat
  }
});

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: `"Easy Budget Security" <${process.env.SMTP_FROM}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    });

    console.log(`✅ Email terkirim ke ${to} | ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("❌ Gagal kirim email:", error);
    return false;
  }
};