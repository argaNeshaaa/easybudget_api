import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  deleteGoalsControllers,
  findAllGoalsControllers,
  findGoalsByIdControllers,
  findGoalsByUserIdControllers,
  insertGoalsControllers,
  updateGoalsControllers,
} from "../controllers/goalsControllers.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/", verifyToken, authorizeRoles("admin", "general"), findAllGoalsControllers);
router.get("/:id", verifyToken, authorizeRoles("admin", "goals"), findGoalsByIdControllers);
router.get("/users/:id", verifyToken, authorizeRoles("admin", "users"), findGoalsByUserIdControllers);
router.post("/", verifyToken, insertGoalsControllers);
router.patch("/:id", verifyToken, authorizeRoles("admin", "goals"), updateGoalsControllers);
router.delete("/:id", verifyToken, authorizeRoles("admin", "goals"), deleteGoalsControllers);
export default router;
