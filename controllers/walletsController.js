import db from "../config/db.js";
import ApiError from "../utils/ApiError.js"; 
import { findWalletsByIdModels, findAllWalletsModels, findWalletsByUserIdModels, insertWalletsModels, updateWalletsModels, deleteWalletsModels } from "../models/walletsModels.js";
import { successResponse, createdResponse, deletedResponse } from "../utils/responseHandler.js";
let context = "Wallet";

export const findAllWalletsControllers = (req, res, next) => {
findAllWalletsModels((err, result) => {
  if(err) {
    return next(ApiError.database(context, "internalServerError"));
  };
  successResponse(res, result);
});
};

export const findWalletsByIdControllers = (req, res, next) => {
  const { id } = req.params;
  findWalletsByIdModels(id, (err, result) => {
    if(err) {
      return next(ApiError.database(context, internalServerError));
    };
    if (result.length === 0) {
          return next(ApiError.notFound(context, "notFound"));
        };
        successResponse(res, result);
  })
}

export const findWalletsByUserIdControllers = (req, res, next) => {
  const { id } = req.params;
  findWalletsByUserIdModels(id, (err, result) => {
    if(err) {
      return next(ApiError.database(context, internalServerError));
    };
    if (result.length === 0) {
          return next(ApiError.notFound(context, "notFound"));
        };
        successResponse(res, result);
  });
};

export const insertWalletsControllers = (req, res, next) => {
  const {name, type, balance, currency} = req.body;
  const idUser = req.user?.user_id;
  insertWalletsModels(idUser, name, type, balance, currency, (err, result) => {
    if(err) {
      if (err.code === 'ER_DUP_ENTRY') {
              return next(ApiError.duplicate(context, "duplicate"));
            }
      return next(ApiError.database(context, internalServerError));
    };
    if (!result || typeof result.insertId === 'undefined') {
          return next(ApiError.database(context, "internalServerError"));
        };
        createdResponse(res, { id: result.insertId }, "Wallets created successfully");
  });
};

export const updateWalletsControllers = (req, res, next) => {
  const {id} = req.params;
  const fields = req.body;
  if (!Object.keys(fields).length) {
      return next(ApiError.validation(context, "No fields provided for update."));
    }
  
    const forbiddenFields = ["wallet_id", "user_id", "created_at"];
    for (const key of Object.keys(fields)) {
      if (forbiddenFields.includes(key)) {
        return next(ApiError.validation(context, `Field '${key}' cannot be modified.`));
      }
    }
  
    updateWalletsModels(id, fields, (err, result) => {    
        if (err) return next(ApiError.database(context, "Update Error"));
    
        if (result.affectedRows === 0) {
          return next(ApiError.notFound(context, "Settings Not Found"));
        }
    
        successResponse(res, {updated_fields: Object.keys(fields)}, "Wallet updated successfully");
      });
    };

    export const deleteWalletsControllers = (req, res, next) => {
      const {id} = req.params;
      deleteWalletsModels(id, (err, result) => {
        if(err) {
          return next(ApiError.database(context, internalServerError));
        }
      if (!result || result.affectedRows === 0) {
            return next(ApiError.notFound(context, "Not Found"));
          }
          deletedResponse(res, "Wallets deleted successfully", {id});
        });
      };