import {
  deleteInvoiceItemsModels,
  findAllInvoiceItemsModels,
  findInvoiceItemsByIdModels,
  findInvoiceItemsByInvoiceIdModels,
  insertInvoiceItemsModels,
  updateInvoiceItemsModels,
} from "../models/invoiceItemsModels.js";
import { findUserByIdModels } from "../models/usersModels.js";
import ApiError from "../utils/ApiError.js";
import { findBusinessesByIdServices } from "./businessesServices.js";
import { findInvoicesByIdServices } from "./invoicesServices.js";
import { findUserByIdService } from "./usersServices.js";

let context = "Invoice Item";

export const findAllInvoiceItemsServices = async () => {
  try {
    const result = await findAllInvoiceItemsModels();

    return result;
  } catch (error) {
    throw ApiError.database(context);
  }
};

export const findInvoiceItemsByIdServices = async (id) => {
  try {
    const result = await findInvoiceItemsByIdModels(id);

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

export const findInvoiceItemsByInvoiceIdServices = async (invoiceId) => {
  try {
    const result = await findInvoiceItemsByInvoiceIdModels(invoiceId);

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

export const insertInvoiceItemsServices = async (
  userId,
  invoiceId,
  description,
  quantity,
  unitPrice
) => {
  try {
    const invoice = await findInvoicesByIdServices(invoiceId);
    const business = await findBusinessesByIdServices(invoice.business_id);
    const user = await findUserByIdService(business.user_id);
    if (user.account_type !== "businesses") throw ApiError.forbidden("Only Businesses Account can access this")
    if (user.user_id !== userId) throw ApiError.forbidden("You can't Access This Invoices");
    const result = await insertInvoiceItemsModels(
      invoiceId,
      description,
      quantity,
      unitPrice
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

export const updateInvoiceItemsServices = async (id, fields) => {
  try {
    if (!Object.keys(fields).length) {
      throw ApiError.validation(context);
    }

    const fieldsToUpdate = { ...fields };

    const forbiddenFields = ["item_id", "invoice_id", "total_price"];
    for (const key of Object.keys(fields)) {
      if (forbiddenFields.includes(key)) {
        throw ApiError.validation(
          context,
          `Field '${key}' cannot be modified.`
        );
      }
    }

    const result = await updateInvoiceItemsModels(id, fieldsToUpdate);

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

export const deleteInvoiceItemsServices = async (id) => {
  try {
    const result = await deleteInvoiceItemsModels(id);

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
