import express from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/usersController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/",verifyToken, authorizeRoles("admin"),  getAllUsers);
router.get("/:id",verifyToken, authorizeRoles("admin"), getUserById);
router.post("/", createUser);
router.patch("/:id",verifyToken, authorizeRoles("admin"), updateUser);
router.delete("/:id",verifyToken, authorizeRoles("admin"), deleteUser);
export default router;
