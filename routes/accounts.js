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
// import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/", verifyToken, findAllAccountsControllers);
router.get("/:id", verifyToken, findAccountsByIdControllers);
router.get("/wallets/:id", verifyToken, findAccountsByWalletIdControllers);
router.post("/", insertAccountsControllers);
router.patch("/:id", verifyToken, updateAccountsControllers);
router.delete("/:id", verifyToken, deleteAccountsControllers);
export default router;
