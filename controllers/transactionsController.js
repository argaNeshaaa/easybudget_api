import {
  deleteTransactionsServices,
  findAllTransactionsServices,
  findTransactionsByIdServices,
  findTransactionsByUserIdServices,
  findTransactionsByWalletIdServices,
  insertTransactionsServices,
  updateTransactionsServices,
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

export const findTransactionsByWalletIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findTransactionsByWalletIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findTransactionsByUserIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findTransactionsByUserIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const insertTransactionsControllers = async (req, res, next) => {
  try {
    const {
      wallet_id,
      category_id,
      account_id,
      type,
      amount,
      description,
      date,
    } = req.body;
    const result = await insertTransactionsServices(
      wallet_id,
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
