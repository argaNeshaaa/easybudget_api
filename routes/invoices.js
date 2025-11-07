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
// import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/", verifyToken, findAllInvoicesControllers);
router.get("/:id", verifyToken, findInvoicesByIdControllers);
router.get("/businesses/:id", verifyToken, findInvoicesByBusinessIdControllers);
router.post("/", verifyToken, insertInvoicesControllers);
router.patch("/:id", verifyToken, updateInvoicesControllers);
router.delete("/:id", verifyToken, deleteInvoicesControllers);
export default router;
