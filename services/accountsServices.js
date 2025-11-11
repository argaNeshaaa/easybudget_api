import {
  deleteAccountsModels,
  findAccountsByIdModels,
  findAccountsByWalletIdModels,
  findAllAccountsModels,
  insertAccountsModels,
  updateAccountsModels,
} from "../models/accountsModels.js";
import ApiError from "../utils/ApiError.js";
import { findWalletsByIdServices } from "./walletsServices.js";

let context = "Account";

export const findAllAccountsServices = async () => {
  try {
    const result = await findAllAccountsModels();

    return result;
  } catch (error) {
    throw ApiError.database(context);
  }
};

export const findAccountsByIdServices = async (id) => {
  try {
    const result = await findAccountsByIdModels(id);

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

export const findAccountsByWalletIdServices = async (walletId) => {
  try {
    const result = await findAccountsByWalletIdModels(walletId);

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

export const insertAccountsServices = async (
  userId,
  walletId,
  accountName,
  accountNumber,
  balance,
  accountType
) => {
  try {
    const wallet = await findWalletsByIdServices(walletId);
    if (wallet.user_id !== userId) throw ApiError.forbidden("You can't Access this Wallet");
    const result = await insertAccountsModels(
      walletId,
      accountName,
      accountNumber,
      balance,
      accountType
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

export const updateAccountsServices = async (id, fields) => {
  try {
    if (!Object.keys(fields).length) {
      throw ApiError.validation(context);
    }

    const fieldsToUpdate = { ...fields };

    const forbiddenFields = [
      "account_id",
      "wallet_id",
      "created_at",
      "updated_at",
    ];
    for (const key of Object.keys(fields)) {
      if (forbiddenFields.includes(key)) {
        throw ApiError.validation(
          context,
          `Field '${key}' cannot be modified.`
        );
      }
    }

    const result = await updateAccountsModels(id, fieldsToUpdate);

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

export const deleteAccountsServices = async (id) => {
  try {
    const result = await deleteAccountsModels(id);

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
