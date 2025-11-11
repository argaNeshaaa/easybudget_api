import express from "express";
import {
  findAllWalletsControllers,
  findWalletsByIdControllers,
  findWalletsByUserIdControllers,
  insertWalletsControllers,
  updateWalletsControllers,
  deleteWalletsControllers,
} from "../controllers/walletsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "general"),
  findAllWalletsControllers
);
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "wallets"),
  findWalletsByIdControllers
);
router.get(
  "/users/:id",
  verifyToken,
  authorizeRoles("admin", "users"),
  findWalletsByUserIdControllers
);
router.post("/", verifyToken, insertWalletsControllers);
router.patch(
  "/:id",
  verifyToken,
  authorizeRoles("self", "wallets"),
  updateWalletsControllers
);
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("self", "wallets"),
  deleteWalletsControllers
);
export default router;
