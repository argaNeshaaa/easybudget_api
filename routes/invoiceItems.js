import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  deleteInvoiceItemsControllers,
  findAllInvoiceItemsControllers,
  findInvoiceItemsByIdControllers,
  findInvoiceItemsByInvoiceIdControllers,
  insertInvoiceItemsControllers,
  updateInvoiceItemsControllers,
} from "../controllers/invoiceItemsControllers.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/", verifyToken, authorizeRoles("admin", "general"), findAllInvoiceItemsControllers);
router.get("/:id", verifyToken, authorizeRoles("admin", "invoice_items"), findInvoiceItemsByIdControllers);
router.get(
  "/invoice/:id",
  verifyToken, authorizeRoles("admin", "invoices"),
  findInvoiceItemsByInvoiceIdControllers
);
router.post("/", verifyToken, insertInvoiceItemsControllers);
router.patch("/:id", verifyToken, authorizeRoles("admin", "invoice_items"), updateInvoiceItemsControllers);
router.delete("/:id", verifyToken, authorizeRoles("admin", "invoice_items"), deleteInvoiceItemsControllers);
export default router;
