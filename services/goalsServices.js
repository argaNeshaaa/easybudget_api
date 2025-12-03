  import {
    deleteGoalsModels,
    findAllGoalsModels,
    findGoalsByIdModels,
    findGoalsByUserIdModels,
    insertGoalsModels,
    updateGoalsModels,
    addGoalAmountModel
  } from "../models/goalsModels.js";
  import ApiError from "../utils/ApiError.js";

  let context = "Goals";

  export const findAllGoalsServices = async () => {
    try {
      const result = await findAllGoalsModels();

      return result;
    } catch (error) {
      throw ApiError.database(context);
    }
  };

  export const findGoalsByIdServices = async (id) => {
    try {
      const result = await findGoalsByIdModels(id);

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

  export const findGoalsByUserIdServices = async (userId, status) => {
  try {
    const result = await findGoalsByUserIdModels(userId, status);
    return result; 
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw ApiError.database(context);
  }
};

  export const insertGoalsServices = async (
    userId,
    name,
    targetAmount,
    currentAmount,
    deadline
  ) => {
    try {
      const result = await insertGoalsModels(
        userId,
        name,
        targetAmount,
        currentAmount,
        deadline
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

  export const updateGoalsServices = async (id, fields) => {
    try {
      if (!Object.keys(fields).length) {
        throw ApiError.validation(context);
      }

      const fieldsToUpdate = { ...fields };

      const forbiddenFields = ["goal_id", "user_id", "created_at"];
      for (const key of Object.keys(fields)) {
        if (forbiddenFields.includes(key)) {
          throw ApiError.validation(
            context,
            `Field '${key}' cannot be modified.`
          );
        }
      }

      const result = await updateGoalsModels(id, fieldsToUpdate);

      if (result.affectedRows === 0) {
        throw ApiError.notFound(context);
      }

      const updated_fields = Object.keys(fields);

      return { updated_fields: updated_fields };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      console.log(error);
      throw ApiError.database(context);
    }
  };

  export const addGoalAmountServices = async (id, amount) => {
  try {
    // 1. Validasi input
    if (!amount || isNaN(amount) || amount <= 0) {
      throw ApiError.validation(context, "Amount must be a positive number");
    }

    // 2. Cek apakah goal ada (Optional, tapi good practice)
    const goal = await findGoalsByIdModels(id);
    if (!goal) throw ApiError.notFound(context);

    // 3. Update Saldo
    const result = await addGoalAmountModel(id, amount);
    
    return result;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw ApiError.database(context);
  }
};

  export const deleteGoalsServices = async (id) => {
    try {
      const result = await deleteGoalsModels(id);

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
