import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getMonthlyReportController, getCategoryReportController, getExecutiveSummaryController, exportReportController } from "../controllers/reportsControllers.js";

const router = express.Router();

// URL: /api/reports/monthly?year=2025
router.get("/monthly", verifyToken, getMonthlyReportController);

// URL: /api/reports/category?month=12&year=2025&type=expense
router.get("/category", verifyToken, getCategoryReportController);

// URL: /api/reports/summary?month=12&year=2025
router.get("/summary", verifyToken, getExecutiveSummaryController);
router.get("/export", verifyToken, exportReportController);

export default router;