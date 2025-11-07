import {
  deleteBudgetsModels,
  findAllBudgetsModels,
  findBudgetsByIdModels,
  findBudgetsByIdUserModels,
  insertBudgetsModels,
  updateBudgetsModels,
} from "../models/budgetsModels.js";
import ApiError from "../utils/ApiError.js";

let context = "Budget";

export const findAllBudgetsServices = async () => {
  try {
    const result = await findAllBudgetsModels();

    return result;
  } catch (error) {
    throw ApiError.database(context);
  }
};

export const findBudgetsByIdServices = async (id) => {
  try {
    const result = await findBudgetsByIdModels(id);

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

export const findBudgetsByIdUserServices = async (idUser) => {
  try {
    const result = await findBudgetsByIdUserModels(idUser);

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

export const insertBudgetsServices = async (
  userId,
  categoryId,
  amount,
  periodStart,
  periodEnd
) => {
  try {
    const result = await insertBudgetsModels(
      userId,
      categoryId,
      amount,
      periodStart,
      periodEnd
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

export const updateBudgetsServices = async (id, fields) => {
  try {
    if (!Object.keys(fields).length) {
      throw ApiError.validation(context);
    }

    const fieldsToUpdate = { ...fields };

    const forbiddenFields = ["budget_id", "user_id", "created_at"];
    for (const key of Object.keys(fields)) {
      if (forbiddenFields.includes(key)) {
        throw ApiError.validation(
          context,
          `Field '${key}' cannot be modified.`
        );
      }
    }

    const result = await updateBudgetsModels(id, fieldsToUpdate);

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

export const deleteBudgetsServices = async (id) => {
  try {
    const result = await deleteBudgetsModels(id);

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
