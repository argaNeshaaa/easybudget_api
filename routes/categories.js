import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  deleteCategoriesControllers,
  findAllCategoriesControllers,
  findCategoriesByIdControllers,
  findCategoriesByUserIdControllers,
  insertCategoriesControllers,
  updateCategoriesControllers,
} from "../controllers/categoriesController.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/", verifyToken, authorizeRoles("admin", "general"), findAllCategoriesControllers);
router.get("/:id", verifyToken, authorizeRoles("admin", "categories"), findCategoriesByIdControllers);
router.get("/users/:id", verifyToken, authorizeRoles("admin", "users"), findCategoriesByUserIdControllers);
router.post("/",verifyToken, insertCategoriesControllers);
router.patch("/:id", verifyToken, authorizeRoles("admin", "categories"), updateCategoriesControllers);
router.delete("/:id", verifyToken, authorizeRoles("admin", "categories"), deleteCategoriesControllers);
export default router;
