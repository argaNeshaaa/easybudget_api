import express from 'express';
import { createSettings, deleteSettings, getAllSettings, getSettingsById,getSettingsByUserID, updateSettingPartial, } from "../controllers/settingsController.js";
import { verifyToken } from "../middleware/authMiddleware.js"
const router = express.Router();

router.get("/",verifyToken, getAllSettings);
router.get("/:id",verifyToken, getSettingsById);
router.get("/user/:user_id",verifyToken, getSettingsByUserID);
router.post("/",verifyToken, createSettings);
router.patch("/:id",verifyToken, updateSettingPartial);
router.delete("/:id",verifyToken, deleteSettings);
export default router;
