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
import upload from "../middleware/upload.js";
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
router.post("/",upload.single("photo"), insertUserControllers);
router.patch(
  "/:id",
  verifyToken,
  authorizeRoles("self", "users"),
  upload.single("photo"),
  updateUserControllers
);
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("self", "users"),
  deleteUserControllers
);
export default router;
