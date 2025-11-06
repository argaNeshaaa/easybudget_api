import { deleteCategoriesServices, findAllCategoriesServices, findCategoriesByIdServices, findCategoriesByUserIdServices, insertCategoriesServices, updateCategoriesServices } from "../services/categoriesServices.js"
import { createdResponse, deletedResponse, successResponse } from "../utils/responseHandler.js";

export const findAllCategoriesControllers = async (req, res, next) => {
  try {
    const result = await findAllCategoriesServices();

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findCategoriesByIdControllers = async (req, res, next) => {
  try {
    const {id} = req.params;
    const result = await findCategoriesByIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findCategoriesByUserIdControllers = async (req, res, next) => {
  try {
    const {id} = req.params;
    const result = await findCategoriesByUserIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const insertCategoriesControllers = async (req, res, next) => {
  try {
    const {user_id, name, type, icon} = req.body;
    const result = await insertCategoriesServices(user_id, name, type, icon);

    createdResponse(res, {id:result.insertId}, "Categories created Succesfully");
  } catch (error) {
    next(error);
  }
};

export const updateCategoriesControllers = async (req, res, next) => {
  try {
    const {id} = req. params;
    const fields = req.body;
    const result = await updateCategoriesServices(id, fields);

    successResponse(res, result, "Categorie updated successfully");
  }  catch (error) {
    next(error);
  }
}

export const deleteCategoriesControllers = async (req, res, next) => {
  try {
    const {id} = req. params;
    const result = await deleteCategoriesServices(id);

    deletedResponse(res, "Category deleted successfuly", {id});
  } catch (error) {
    next(error);
  }
};
