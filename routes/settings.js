import express from "express";
import {
  findAllSettingsControllers,
  findSettingsByUserIdControllers,
  insertSettingsControllers,
  updateSettingsControllers,
  deleteSettingsControllers,
} from "../controllers/settingsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "general"),
  findAllSettingsControllers
);
router.get(
  "/users/:id",
  verifyToken,
  authorizeRoles("admin", "users"),
  findSettingsByUserIdControllers
);
router.post(
  "/",
  verifyToken,
  insertSettingsControllers
);
router.patch(
  "/users/:id",
  verifyToken,
  authorizeRoles("self", "users"),
  updateSettingsControllers
);
router.delete(
  "/users/:id",
  verifyToken,
  authorizeRoles("self", "users"),
  deleteSettingsControllers
);
export default router;
