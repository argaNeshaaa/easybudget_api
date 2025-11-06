import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { deleteTransactionsControllers, findAllTransactionsControllers, findTransactionsByIdControllers, findTransactionsByUserIdControllers, findTransactionsByWalletIdControllers, insertTransactionsControllers, updateTransactionsControllers } from "../controllers/transactionsController.js";
// import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/",verifyToken, findAllTransactionsControllers);
router.get("/:id",verifyToken, findTransactionsByIdControllers);
router.get("/wallets/:id",verifyToken, findTransactionsByWalletIdControllers);
router.get("/users/:id",verifyToken, findTransactionsByUserIdControllers);
router.post("/", insertTransactionsControllers);
router.patch("/:id",verifyToken, updateTransactionsControllers);
router.delete("/:id",verifyToken, deleteTransactionsControllers);
export default router;
