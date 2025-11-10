import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  deleteInvoicesControllers,
  findAllInvoicesControllers,
  findInvoicesByBusinessIdControllers,
  findInvoicesByIdControllers,
  insertInvoicesControllers,
  updateInvoicesControllers,
} from "../controllers/invoiceControllers.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/", verifyToken, authorizeRoles("admin", "general"), findAllInvoicesControllers);
router.get("/:id", verifyToken, authorizeRoles("admin", "invoices"), findInvoicesByIdControllers);
router.get("/businesses/:id", verifyToken, authorizeRoles("admin", "businesses"), findInvoicesByBusinessIdControllers);
router.post("/", verifyToken, insertInvoicesControllers);
router.patch("/:id", verifyToken, authorizeRoles("admin", "invoices"), updateInvoicesControllers);
router.delete("/:id", verifyToken, authorizeRoles("admin", "invoices"), deleteInvoicesControllers);
export default router;
