import { deleteInvoicesServices, findAllInvoicesServices, findInvoicesByBusinessIdServices, findInvoicesByIdServices, insertInvoicesServices, updateInvoicesServices } from "../services/invoicesServices.js"
import { createdResponse, deletedResponse, successResponse } from "../utils/responseHandler.js";


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
        const {id} = req.params;
        const result = await findInvoicesByIdServices(id);

        successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const findInvoicesByBusinessIdControllers = async (req, res, next) => {
    try {
        const {id} = req.params;
        const result = await findInvoicesByBusinessIdServices(id);

        successResponse(res, result)
    } catch (error) {
        next(error);
    }
};

export const insertInvoicesControllers = async (req, res, next) => {
    try {
        const { business_id, invoice_number, client_name, total_amount, status, issue_date, due_date, created_at} = req.body;
        const result = await insertInvoicesServices(business_id, invoice_number, client_name, total_amount, status, issue_date, due_date, created_at);

        createdResponse(res, {id: result.insertId}, "Invoice Created Succesfully");
    } catch (error) {
        next(error);
    }
};

export const updateInvoicesControllers = async (req, res, next) => {
    try {
        const {id} = req.params;
        const fields = req.body;
        const result = await updateInvoicesServices(id, fields);
        
        successResponse(res, result, "User updated successfully");
    } catch (error) {
        next(error);
  }
};

export const deleteInvoicesControllers = async (req, res, next) => {
    try {
        const {id} = req.params;
        const result = await deleteInvoicesServices(id);

        deletedResponse(res, "Invoice Deleted Succesfully", {id});
    } catch (error) {
        next(error);
    }
};