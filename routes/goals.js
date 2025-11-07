import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
// import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

// router.get("/",verifyToken,);
// router.get("/:id",verifyToken,);
// router.get("/users/:id",verifyToken,);
// router.post("/",);
// router.patch("/:id",verifyToken,);
// router.delete("/:id",verifyToken,);
export default router;