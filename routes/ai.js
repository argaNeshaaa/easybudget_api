import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { chatControllers } from "../controllers/aiControllers.js";

const router = express.Router();

// POST /api/ai/chat
router.post("/chat", verifyToken, chatControllers);

export default router;