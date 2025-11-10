import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  deleteBudgetsControllers,
  findAllBudgetsControllers,
  findBudgetsByIdControllers,
  findBudgetsByIdUserControllers,
  insertBudgetsControllers,
  updateBudgetsControllers,
} from "../controllers/budgetsController.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/", verifyToken, authorizeRoles("admin", "general"), findAllBudgetsControllers);
router.get("/:id", verifyToken, authorizeRoles("admin", "budgets"), findBudgetsByIdControllers);
router.get("/users/:id", verifyToken, authorizeRoles("admin", "users"), findBudgetsByIdUserControllers);
router.post("/", verifyToken, insertBudgetsControllers);
router.patch("/:id", verifyToken, authorizeRoles("admin", "budgets"), updateBudgetsControllers);
router.delete("/:id", verifyToken, authorizeRoles("admin", "budgets"), deleteBudgetsControllers);
export default router;
