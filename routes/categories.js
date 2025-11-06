import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { deleteCategoriesControllers, findAllCategoriesControllers, findCategoriesByIdControllers, findCategoriesByUserIdControllers, insertCategoriesControllers, updateCategoriesControllers } from "../controllers/categoriesController.js";
// import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get("/",verifyToken, findAllCategoriesControllers);
router.get("/:id",verifyToken, findCategoriesByIdControllers);
router.get("/users/:id",verifyToken, findCategoriesByUserIdControllers);
router.post("/", insertCategoriesControllers);
router.patch("/:id",verifyToken, updateCategoriesControllers);
router.delete("/:id",verifyToken, deleteCategoriesControllers);
export default router;
