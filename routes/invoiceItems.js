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
// import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/", verifyToken, findAllInvoiceItemsControllers);
router.get("/:id", verifyToken, findInvoiceItemsByIdControllers);
router.get(
  "/invoice/:id",
  verifyToken,
  findInvoiceItemsByInvoiceIdControllers
);
router.post("/", verifyToken, insertInvoiceItemsControllers);
router.patch("/:id", verifyToken, updateInvoiceItemsControllers);
router.delete("/:id", verifyToken, deleteInvoiceItemsControllers);
export default router;
