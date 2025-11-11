import {
  deleteInvoiceItemsServices,
  findAllInvoiceItemsServices,
  findInvoiceItemsByIdServices,
  findInvoiceItemsByInvoiceIdServices,
  insertInvoiceItemsServices,
  updateInvoiceItemsServices,
} from "../services/invoiceItemsServices.js";
import {
  createdResponse,
  deletedResponse,
  successResponse,
} from "../utils/responseHandler.js";

export const findAllInvoiceItemsControllers = async (req, res, next) => {
  try {
    const result = await findAllInvoiceItemsServices();

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findInvoiceItemsByIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findInvoiceItemsByIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findInvoiceItemsByInvoiceIdControllers = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const result = await findInvoiceItemsByInvoiceIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const insertInvoiceItemsControllers = async (req, res, next) => {
  try {
    const { invoice_id, description, quantity, unit_price } = req.body;
    const user_id = req.user?.user_id;
    const result = await insertInvoiceItemsServices(
      user_id,
      invoice_id,
      description,
      quantity,
      unit_price
    );

    createdResponse(
      res,
      { id: result.insertId },
      "Invoice Item Created Succesfully"
    );
  } catch (error) {
    next(error);
  }
};

export const updateInvoiceItemsControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const result = await updateInvoiceItemsServices(id, fields);

    successResponse(res, result, "Invoice Item Updated Succesfully");
  } catch (error) {
    next(error);
  }
};

export const deleteInvoiceItemsControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteInvoiceItemsServices(id);

    deletedResponse(res, "Invoice Item Deleted Succesfully", { id });
  } catch (error) {
    next(error);
  }
};
