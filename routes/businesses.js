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
import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/", verifyToken, authorizeRoles("admin", "general"), findAllBusinessesControllers);
router.get("/:id",verifyToken, authorizeRoles("admin", "businesses"), findBusinessesByIdControllers);
router.get("/users/:id", verifyToken, authorizeRoles("admin", "users"), findBusinessesByUserIdControllers);
router.post("/", verifyToken, insertBusinessesControllers);
router.patch("/:id", verifyToken, authorizeRoles("admin", "businesses"), updateBusinessesControllers);
router.delete("/:id", verifyToken, authorizeRoles("admin", "businesses"), deleteBusinessesControllers);
export default router;
