import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  deleteBusinessesControllers,
  findAllBusinessesControllers,
  findBusinessesByIdControllers,
  findBusinessesByUserIdControllers,
  insertBusinessesControllers,
  updateBusinessesControllers,
} from "../controllers/businessesControllers.js";
// import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/", verifyToken, findAllBusinessesControllers);
router.get("/:id", findBusinessesByIdControllers);
router.get("/users/:id", findBusinessesByUserIdControllers);
router.post("/", insertBusinessesControllers);
router.patch("/:id", verifyToken, updateBusinessesControllers);
router.delete("/:id", verifyToken, deleteBusinessesControllers);
export default router;
