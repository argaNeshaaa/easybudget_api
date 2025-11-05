import ApiError from "../utils/ApiError.js"; 
import { successResponse, createdResponse, deletedResponse } from "../utils/responseHandler.js";
import { findAllAccountsModels } from "../models/accountsModels.js";
let context = "Accounts";

export const findAllAccountsControllers = (req, res, next) => {
    findAllAccountsModels((err, result) => {
        if(err) {
            return next(ApiError.database(context, "internalServerError"));
        }
        successResponse(res, result);
    });
};