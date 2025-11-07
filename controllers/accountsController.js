import {
  successResponse,
  createdResponse,
  deletedResponse,
} from "../utils/responseHandler.js";
import {
  deleteAccountsServices,
  findAccountsByIdServices,
  findAccountsByWalletIdServices,
  findAllAccountsServices,
  insertAccountsServices,
  updateAccountsServices,
} from "../services/accountsServices.js";
let context = "Accounts";

export const findAllAccountsControllers = async (req, res, next) => {
  try {
    const result = await findAllAccountsServices();

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findAccountsByIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findAccountsByIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findAccountsByWalletIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findAccountsByWalletIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const insertAccountsControllers = async (req, res, next) => {
  try {
    const { wallet_id, account_name, account_number, balance, account_type } =
      req.body;
    const result = await insertAccountsServices(
      wallet_id,
      account_name,
      account_number,
      balance,
      account_type
    );

    createdResponse(
      res,
      { id: result.insertId },
      "Account created Succesfully"
    );
  } catch (error) {
    next(error);
  }
};

export const updateAccountsControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const result = await updateAccountsServices(id, fields);

    successResponse(res, result, "Account updated Succesfully");
  } catch (error) {
    next(error);
  }
};

export const deleteAccountsControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteAccountsServices(id);

    deletedResponse(res, "Account deleted Succesfully", { id });
  } catch (error) {
    next(error);
  }
};
