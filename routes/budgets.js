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
// import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/", verifyToken, findAllBudgetsControllers);
router.get("/:id", verifyToken, findBudgetsByIdControllers);
router.get("/users/:id", verifyToken, findBudgetsByIdUserControllers);
router.post("/", verifyToken, insertBudgetsControllers);
router.patch("/:id", verifyToken, updateBudgetsControllers);
router.delete("/:id", verifyToken, deleteBudgetsControllers);
export default router;
