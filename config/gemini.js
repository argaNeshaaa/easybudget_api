import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
let model;
try {
  // Ganti ke 'gemini-1.5-flash'
  model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
} catch {
  try {
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  } catch {
    
  }
}

export default model;
