import {
  deleteBusinessesModels,
  findAllBusinessesModels,
  findBusinessesByIdModels,
  findBusinessesByUserIdModels,
  insertBusinessesModels,
  updateBusinessesModels,
} from "../models/businessesModels.js";
import ApiError from "../utils/ApiError.js";

let context = "Business";

export const findAllBusinessesServices = async () => {
  try {
    const result = await findAllBusinessesModels();

    return result;
  } catch (error) {
    throw ApiError.database(context);
  }
};

export const findBusinessesByIdServices = async (id) => {
  try {
    const result = await findBusinessesByIdModels(id);

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

export const findBusinessesByUserIdServices = async (userId) => {
  try {
    const result = await findBusinessesByUserIdModels(userId);

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

export const insertBusinessesServices = async (
  userId,
  name,
  industry,
  address
) => {
  try {
    const result = await insertBusinessesModels(
      userId,
      name,
      industry,
      address
    );

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

export const updateBusinessesServices = async (id, fields) => {
  try {
    if (!Object.keys(fields).length) {
      throw ApiError.validation(context);
    }

    const fieldsToUpdate = { ...fields };

    const forbiddenFields = ["business_id", "user_id", "created_at"];
    for (const key of Object.keys(fields)) {
      if (forbiddenFields.includes(key)) {
        throw ApiError.validation(
          context,
          `Field '${key}' cannot be modified.`
        );
      }
    }

    const result = await updateBusinessesModels(id, fieldsToUpdate);

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

export const deleteBusinessesServices = async (id) => {
  try {
    const result = await deleteBusinessesModels(id);

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
