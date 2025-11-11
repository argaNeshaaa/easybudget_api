import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  deleteAccountsControllers,
  findAccountsByIdControllers,
  findAccountsByWalletIdControllers,
  findAllAccountsControllers,
  insertAccountsControllers,
  updateAccountsControllers,
} from "../controllers/accountsController.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/", verifyToken, authorizeRoles("admin", "general"), findAllAccountsControllers);
router.get("/:id", verifyToken,authorizeRoles("admin", "accounts"), findAccountsByIdControllers);
router.get("/wallets/:id", verifyToken, authorizeRoles("admin", "wallets"), findAccountsByWalletIdControllers);
router.post("/", verifyToken, insertAccountsControllers);
router.patch("/:id", verifyToken,authorizeRoles("self", "accounts"), updateAccountsControllers);
router.delete("/:id", verifyToken,authorizeRoles("self", "accounts"), deleteAccountsControllers);
export default router;
