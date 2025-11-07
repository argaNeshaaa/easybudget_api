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
// import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/", verifyToken, findAllGoalsControllers);
router.get("/:id", verifyToken, findGoalsByIdControllers);
router.get("/users/:id", verifyToken, findGoalsByUserIdControllers);
router.post("/", insertGoalsControllers);
router.patch("/:id", verifyToken, updateGoalsControllers);
router.delete("/:id", verifyToken, deleteGoalsControllers);
export default router;
