import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Ganti ke 'gemini-1.5-flash'
const model = genAI.getGenerativeModel({ model: process.env.API_MODEL });
console.log("API KEY:", process.env.GEMINI_API_KEY);
console.log("MODEL:", process.env.API_MODEL);
export default model;