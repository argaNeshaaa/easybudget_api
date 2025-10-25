import express from "express";
import { getAllBudgets, getBudgetById } from "../controllers/budgetsController.js";

const router = express.Router();

router.get("/", getAllBudgets);
router.get("/:id", getBudgetById);

export default router;
