import express from "express";
import {
  findAllUsersControllers,
  findUserByIdControllers,
  insertUserControllers,
  updateUserControllers,
  deleteUserControllers,
} from "../controllers/usersController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "general"),
  findAllUsersControllers
);
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "users"),
  findUserByIdControllers
);
router.post("/", insertUserControllers);
router.patch(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "users"),
  updateUserControllers
);
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "users"),
  deleteUserControllers
);
export default router;
