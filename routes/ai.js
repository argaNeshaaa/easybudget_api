import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { chatController } from "../controllers/aiControllers.js";

const router = express.Router();

// POST /api/ai/chat
router.post("/chat", verifyToken, chatController);

export default router;