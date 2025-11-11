import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  deleteTransactionsControllers,
  findAllTransactionsControllers,
  findTransactionsByAccountIdControllers,
  findTransactionsByIdControllers,
  findTransactionsByUserIdControllers,
  insertTransactionsControllers,
  updateTransactionsControllers,
} from "../controllers/transactionsController.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/", verifyToken, authorizeRoles("admin", "general"), findAllTransactionsControllers);
router.get("/:id", verifyToken, authorizeRoles("admin", "transactions"), findTransactionsByIdControllers);
router.get("/accounts/:id", verifyToken, authorizeRoles("admin", "accounts"), findTransactionsByAccountIdControllers);
router.get("/users/:id", verifyToken, authorizeRoles("admin", "users"), findTransactionsByUserIdControllers);
router.post("/", verifyToken, insertTransactionsControllers);
router.patch("/:id", verifyToken, authorizeRoles("self", "transactions"), updateTransactionsControllers);
router.delete("/:id", verifyToken, authorizeRoles("self", "transactions"), deleteTransactionsControllers);
export default router;
