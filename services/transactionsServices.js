import { findAccountsByIdModels } from "../models/accountsModels.js";
import {
  deleteTransactionsModels,
  findAllTransactionsModels,
  findTransactionsByAccountIdModels,
  findTransactionsByIdModels,
  findTransactionsByUserIdModels,
  insertTransactionsModels,
  updateTransactionsModels,
} from "../models/transactionsModels.js";
import ApiError from "../utils/ApiError.js";
import { findAccountsByIdServices } from "./accountsServices.js";
import { findCategoriesByIdServices } from "./categoriesServices.js";
import { findWalletsByIdServices } from "./walletsServices.js";

let context = "Transaction";

export const findAllTransactionsServices = async () => {
  try {
    const result = await findAllTransactionsModels();

    return result;
  } catch (error) {
    throw ApiError.database(context);
  }
};

export const findTransactionsByIdServices = async (id) => {
  try {
    const result = await findTransactionsByIdModels(id);

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

export const findTransactionsByAccountIdServices = async (accountId) => {
  try {
    const result = await findTransactionsByAccountIdModels(accountId);

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

export const findTransactionsByUserIdServices = async (userId) => {
  try {
    const result = await findTransactionsByUserIdModels(userId);

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

export const insertTransactionsServices = async (
  userId,
  categoryId,
  accountId,
  type,
  amount,
  description,
  date
) => {
  try {
    const category = await findCategoriesByIdServices(categoryId);
    if (category.user_id !== userId) throw ApiError.forbidden("You don't have permission to access this Resource");

    const account = await findAccountsByIdServices(accountId);
    const wallet = await findWalletsByIdServices(account.wallet_id);

    if (wallet.user_id !== userId) {
      throw ApiError.forbidden("You don't have permission to access this Resource")};
    const result = await insertTransactionsModels(
      categoryId,
      accountId,
      type,
      amount,
      description,
      date
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

export const updateTransactionsServices = async (id, fields) => {
  try {
    if (!Object.keys(fields).length) {
      throw ApiError.validation(context);
    }

    const fieldsToUpdate = { ...fields };

    const forbiddenFields = ["transaction_id","account_id", "created_at"];
    for (const key of Object.keys(fields)) {
      if (forbiddenFields.includes(key)) {
        throw ApiError.validation(
          context,
          `Field '${key}' cannot be modified.`
        );
      }
    }

    const result = await updateTransactionsModels(id, fieldsToUpdate);

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

export const deleteTransactionsServices = async (id) => {
  try {
    const result = await deleteTransactionsModels(id);

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
