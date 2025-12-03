import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Gunakan 'gemini-1.5-flash' yang lebih baru dan stabil
// atau gunakan 'gemini-pro' jika Anda yakin akun Anda punya akses
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default model;