import express from "express";
import { deleteProfileController, findProfileByUserController, insertProfileController, updateProfileController } from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, findProfileByUserController);
router.post("/", verifyToken, insertProfileController);
router.patch("/", verifyToken, updateProfileController);
router.delete("/", verifyToken, deleteProfileController);

export default router;