import express from "express";
import { findAllUsersControllers, findUserByIdControllers, insertUserControllers, updateUserControllers, deleteUserControllers } from "../controllers/usersController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/",verifyToken, authorizeRoles("admin"),  findAllUsersControllers);
router.get("/:id",verifyToken, authorizeRoles("admin"), findUserByIdControllers);
router.post("/", insertUserControllers);
router.patch("/:id",verifyToken, authorizeRoles("admin"), updateUserControllers);
router.delete("/:id",verifyToken, authorizeRoles("admin"), deleteUserControllers);
export default router;
