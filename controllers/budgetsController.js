import {
  deleteBudgetsServices,
  findAllBudgetsServices,
  findBudgetsByIdServices,
  findBudgetsByIdUserServices,
  insertBudgetsServices,
  updateBudgetsServices,
} from "../services/budgetsServices.js";
import {
  createdResponse,
  deletedResponse,
  successResponse,
} from "../utils/responseHandler.js";

export const findAllBudgetsControllers = async (req, res, next) => {
  try {
    const result = await findAllBudgetsServices();

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findBudgetsByIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findBudgetsByIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findBudgetsByIdUserControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findBudgetsByIdUserServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const insertBudgetsControllers = async (req, res, next) => {
  try {
    const { user_id, category_id, amount, period_start, period_end } = req.body;
    const result = await insertBudgetsServices(
      user_id,
      category_id,
      amount,
      period_start,
      period_end
    );

    createdResponse(
      res,
      { id: result.insertId },
      "Budgets Created Succesfully"
    );
  } catch (error) {
    next(error);
  }
};

export const updateBudgetsControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const result = await updateBudgetsServices(id, fields);

    successResponse(res, result, "Budget Updated Succesfully");
  } catch (error) {
    next(error);
  }
};

export const deleteBudgetsControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteBudgetsServices(id);

    deletedResponse(res, "Budget Deleted Succesfully", { id });
  } catch (error) {
    next(error);
  }
};
