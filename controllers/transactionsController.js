import {
  deleteTransactionsServices,
  findAllTransactionsServices,
  findTransactionsByAccountIdServices,
  findTransactionsByIdServices,
  findTransactionsByUserIdServices,
  insertTransactionsServices,
  updateTransactionsServices,
  calculateTotalAmountServices,
  getWeeklySummaryServices,
  getMonthlySummaryServices,
  getWeeklyTransactionsListServices,
  getAccountMonthlyStatsServices,
  getTransactionsWithFiltersServices
} from "../services/transactionsServices.js";
import {
  createdResponse,
  deletedResponse,
  successResponse,
} from "../utils/responseHandler.js";

export const findAllTransactionsControllers = async (req, res, next) => {
  try {
    const result = await findAllTransactionsServices();

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findTransactionsByIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findTransactionsByIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findTransactionsByAccountIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findTransactionsByAccountIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findTransactionsByUserIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const { type, month, year } = req.query;

    const filters = { type, month, year };

    const result = await findTransactionsByUserIdServices(id, filters);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};


export const getTotalAmountController = async (req, res, next) => {
  try {
    const userId = req.user.user_id; // Dari token
    const { type, month, year } = req.query; // Dari URL (?type=income&month=12...)

    const result = await calculateTotalAmountServices(userId, type, month, year);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const GetAllTransactionsControllers = async (req, res, next) => {
  try {
    const userId = req.user.user_id; // Dari Token
    const params = req.query; // Ambil semua ?page=1&search=makan

    const result = await getTransactionsWithFiltersServices(userId, params);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getWeeklySummaryController = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const result = await getWeeklySummaryServices(userId);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getWeeklyTransactionsListController = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const result = await getWeeklyTransactionsListServices(userId);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getMonthlySummaryController = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const result = await getMonthlySummaryServices(userId);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};


export const getAccountMonthlyStatsController = async (req, res, next) => {
  try {
    const { id } = req.params; // account_id diambil dari URL
    const result = await getAccountMonthlyStatsServices(id);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const insertTransactionsControllers = async (req, res, next) => {
  try {
    const {
      category_id,
      account_id,
      type,
      amount,
      description,
      date,
    } = req.body;
    const user_id = req.user?.user_id;
    const result = await insertTransactionsServices(
      user_id,
      category_id,
      account_id,
      type,
      amount,
      description,
      date
    );

    createdResponse(
      res,
      { id: result.insertId },
      "Transaction created succesfully"
    );
  } catch (error) {
    next(error);
  }
};

export const updateTransactionsControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const result = await updateTransactionsServices(id, fields);

    successResponse(res, result, "Transaction updated Succesfully");
  } catch (error) {
    next(error);
  }
};

export const deleteTransactionsControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteTransactionsServices(id);

    deletedResponse(res, "Transactions deleted Succesfully", { id });
  } catch (error) {
    next(error);
  }
};
