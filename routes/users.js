import express from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/usersController.js";
import { verifyToken } from "../middleware/authMiddleware.js"
const router = express.Router();

router.get("/",verifyToken, getAllUsers);
router.get("/:id",verifyToken, getUserById);
router.post("/", createUser);
router.patch("/:id",verifyToken, updateUser);
router.delete("/:id",verifyToken, deleteUser);
export default router;
