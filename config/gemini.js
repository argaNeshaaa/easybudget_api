import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Pastikan API Key ada
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Gunakan model 'gemini-pro' untuk teks
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export default model;