import {
  deleteCategoriesModels,
  findAllCategoriesModels,
  findCategoriesByIdModels,
  findCategoriesByUserIdModels,
  insertCategoriesModels,
  updateCategoriesModels,
} from "../models/categoriesModels.js";
import ApiError from "../utils/ApiError.js";
import { findUserByIdService } from "./usersServices.js";

let context = "Category";

export const findAllCategoriesServices = async () => {
  try {
    const result = await findAllCategoriesModels();

    return result;
  } catch (error) {
    throw ApiError.database(context);
  }
};

export const findCategoriesByIdServices = async (id) => {
  try {
    const result = await findCategoriesByIdModels(id);

    if (!result || result.length === 0) {
      throw ApiError.notFound(context);
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.database(context);
  }
};

export const findCategoriesByUserIdServices = async (userId) => {
  context = "User";
  try {
    const result = await findCategoriesByUserIdModels(userId);

    if (!result || result.length === 0) {
      throw ApiError.notFound(context);
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.database(context);
  }
};

export const insertCategoriesServices = async (userId, name, type, icon) => {
  try {
    const user = await findUserByIdService(userId);
    const result = await insertCategoriesModels(userId, name, type, icon);

    if (!result || typeof result.insertId === "undefined") {
      throw ApiError.database(context);
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.database(context);
  }
};

export const updateCategoriesServices = async (id, fields) => {
  try {
    if (!Object.keys(fields).length) {
      throw ApiError.validation(context);
    }

    const fieldsToUpdate = { ...fields };

    const forbiddenFields = ["category_id", "user_id"];
    for (const key of Object.keys(fields)) {
      if (forbiddenFields.includes(key)) {
        throw ApiError.validation(
          context,
          `Field '${key}' cannot be modified.`
        );
      }
    }

    const result = await updateCategoriesModels(id, fieldsToUpdate);

    if (result.affectedRows === 0) {
      throw ApiError.notFound(context);
    }

    const updated_fields = Object.keys(fields);

    return { updated_fields: updated_fields };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.database(context);
  }
};

export const deleteCategoriesServices = async (id) => {
  try {
    const result = await deleteCategoriesModels(id);

    if (!result || result.affectedRows === 0) {
      throw ApiError.notFound(context);
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.database(context);
  }
};
