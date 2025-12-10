import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// 1. Buat Transporter (Tukang Pos)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // false untuk port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 2. Fungsi Kirim Email
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: `"Easy Budget Admin" <${process.env.SMTP_FROM}>`, // Sender address
      to: to, // List of receivers
      subject: subject, // Subject line
      html: htmlContent, // HTML body content
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};