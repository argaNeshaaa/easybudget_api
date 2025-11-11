import {
  deleteInvoicesServices,
  findAllInvoicesServices,
  findInvoicesByBusinessIdServices,
  findInvoicesByIdServices,
  insertInvoicesServices,
  updateInvoicesServices,
} from "../services/invoicesServices.js";
import {
  createdResponse,
  deletedResponse,
  successResponse,
} from "../utils/responseHandler.js";

export const findAllInvoicesControllers = async (req, res, next) => {
  try {
    const result = await findAllInvoicesServices();

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findInvoicesByIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findInvoicesByIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findInvoicesByBusinessIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findInvoicesByBusinessIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const insertInvoicesControllers = async (req, res, next) => {
  try {
    const {
      business_id,
      invoice_number,
      client_name,
      status,
      issue_date,
      due_date
    } = req.body;
    const user_id = req.user?.user_id;
    const result = await insertInvoicesServices(
      user_id,
      business_id,
      invoice_number,
      client_name,
      status,
      issue_date,
      due_date
    );

    createdResponse(
      res,
      { id: result.insertId },
      "Invoice Created Succesfully"
    );
  } catch (error) {
    next(error);
  }
};

export const updateInvoicesControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const result = await updateInvoicesServices(id, fields);

    successResponse(res, result, "User updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteInvoicesControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteInvoicesServices(id);

    deletedResponse(res, "Invoice Deleted Succesfully", { id });
  } catch (error) {
    next(error);
  }
};
