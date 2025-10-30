import express from "express";
import { findAllWalletsControllers, findWalletsByIdControllers, findWalletsByUserIdControllers, insertWalletsControllers, updateWalletsControllers, deleteWalletsControllers } from "../controllers/walletsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles, authorizeWalletAccess } from "../middleware/authorizeRoles.js";

const router = express.Router();

router.get("/", verifyToken, authorizeWalletAccess("admin"), findAllWalletsControllers);
router.get("/:id", verifyToken, authorizeWalletAccess("admin"), findWalletsByIdControllers);
router.get("/users/:id", verifyToken, authorizeRoles("admin"), findWalletsByUserIdControllers);
router.post("/", verifyToken, insertWalletsControllers);
router.patch("/:id", verifyToken, authorizeWalletAccess("admin"), updateWalletsControllers);
router.delete("/:id", verifyToken, authorizeWalletAccess("admin"), deleteWalletsControllers);
export default router;
