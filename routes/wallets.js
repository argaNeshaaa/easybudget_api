import express from "express";
import { getAllWallets, getWalletById } from "../controllers/walletsController.js";

const router = express.Router();

router.get("/", getAllWallets);
router.get("/:id", getWalletById);

export default router;
