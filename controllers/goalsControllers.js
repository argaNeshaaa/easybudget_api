import {
  deleteGoalsServices,
  findAllGoalsServices,
  findGoalsByIdServices,
  findGoalsByUserIdServices,
  insertGoalsServices,
  updateGoalsServices,
} from "../services/goalsServices.js";
import {
  createdResponse,
  deletedResponse,
  successResponse,
} from "../utils/responseHandler.js";

export const findAllGoalsControllers = async (req, res, next) => {
  try {
    const result = await findAllGoalsServices();

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findGoalsByIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findGoalsByIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findGoalsByUserIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findGoalsByUserIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const insertGoalsControllers = async (req, res, next) => {
  try {
    const { name, target_amount, current_amount, deadline } = req.body;
      const user_id = req.user?.user_id;
    const result = await insertGoalsServices(
      user_id,
      name,
      target_amount,
      current_amount,
      deadline,
    );

    createdResponse(res, { id: result.insertId }, "Goal Created Succesfully");
  } catch (error) {
    next(error);
  }
};

export const updateGoalsControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const result = await updateGoalsServices(id, fields);

    successResponse(res, result, "Goal Updated Succesfully");
  } catch (error) {
    next(error);
  }
};

export const deleteGoalsControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteGoalsServices(id);

    deletedResponse(res, "Goal Deleted Succesfully", { id });
  } catch (error) {
    next(error);
  }
};
