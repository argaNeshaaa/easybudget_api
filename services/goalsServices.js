import { findAllGoalsModels, findGoalsByIdModels, findGoalsByUserIdModels } from "../models/goalsModels.js";
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

export const findGoalsByUserIdServices = async (userId) => {
    try {
        const result = await findGoalsByUserIdModels(userId);

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

export const insertGoalsServices = async (userId, name, targetAmount, currentAmount, deadline, status) => {
    try {
        
    }
}