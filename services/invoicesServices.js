import {
  deleteInvoicesModels,
  findAllInvoicesModels,
  findInvoicesByBusinessIdModels,
  findInvoicesByIdModels,
  insertInvoicesModels,
  updateInvoicesModels,
} from "../models/invoicesModels.js";
import ApiError from "../utils/ApiError.js";
import { findUserByIdService } from "./usersServices.js";

let context = "Invoice";

export const findAllInvoicesServices = async () => {
  try {
    const result = await findAllInvoicesModels();

    return result;
  } catch (error) {
    throw ApiError.database(context);
  }
};

export const findInvoicesByIdServices = async (id) => {
  try {
    const result = await findInvoicesByIdModels(id);

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

export const findInvoicesByBusinessIdServices = async (businessId) => {
  try {
    const result = await findInvoicesByBusinessIdModels(businessId);

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

export const insertInvoicesServices = async (
  userId,
  businessId,
  invoiceNumber,
  clientName,
  status,
  issueDate,
  dueDate
) => {
  try {
    const user = await findUserByIdService(userId);
    if (user.account_type !== "businesses") throw ApiError.forbidden("Only Businesses Account can access this")
    const result = await insertInvoicesModels(
      businessId,
      invoiceNumber,
      clientName,
      status,
      issueDate,
      dueDate
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

export const updateInvoicesServices = async (id, fields) => {
  try {
    if (!Object.keys(fields).length) {
      throw ApiError.validation(context);
    }

    const fieldsToUpdate = { ...fields };

    const forbiddenFields = ["invoice_id", "business_id", "created_at", "total_amount"];
    for (const key of Object.keys(fields)) {
      if (forbiddenFields.includes(key)) {
        throw ApiError.validation(
          context,
          `Field '${key}' cannot be modified.`
        );
      }
    }

    const result = await updateInvoicesModels(id, fieldsToUpdate);

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

export const deleteInvoicesServices = async (id) => {
  try {
    const result = await deleteInvoicesModels(id);

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
