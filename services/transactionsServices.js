import {
  deleteTransactionsModels,
  findAllTransactionsModels,
  findTransactionsByIdModels,
  findTransactionsByUserIdModels,
  findTransactionsByWalletIdModels,
  insertTransactionsModels,
} from "../models/transactionsModels.js";
import ApiError from "../utils/ApiError.js";

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

export const findTransactionsByWalletIdServices = async (walletId) => {
  try {
    const result = await findTransactionsByWalletIdModels(walletId);

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
  walletId,
  categoryId,
  accountId,
  type,
  amount,
  description,
  date
) => {
  try {
    const result = await insertTransactionsModels(
      walletId,
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

    const forbiddenFields = ["transaction_id", "created_at"];
    for (const key of Object.keys(fields)) {
      if (forbiddenFields.includes(key)) {
        throw ApiError.validation(
          context,
          `Field '${key}' cannot be modified.`
        );
      }
    }

    const result = await updateUserModels(id, fieldsToUpdate);

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
