import db from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { checkUserQueryModels, deleteSettingsModels, findAllSettingsModels, findSettingsByUserIdModels, insertSettingsModels, updateSettingsModels

 } from "../models/settingsModels.js";
import { createdResponse, deletedResponse, successResponse } from "../utils/responseHandler.js";

const context = "Settings";

export const findAllSettingsControllers = (req, res, next) => {
  findAllSettingsModels((err, result) => {
    if (err) {
      return next(ApiError.database(context,"Fail GET"))
    }
    successResponse(res, result);
  });
};

export const findSettingsByUserIdControllers = (req, res, next) => {
  const {id} = req.params;
  findSettingsByUserIdModels(id, (err, result) => {
    if (err) {
        return next(ApiError.database(context, internalServerError));
      }
  
      if (result.length === 0) {
        return next(ApiError.notFound(context, "notFound"));
      }
  
      successResponse(res, result);
  });
};

export const insertSettingsControllers = (req, res, next) => {
  const { user_id, theme, currency, language, notification } = req.body;
  checkUserQueryModels(user_id, (err, result) => {
    if (err) {
      return next(ApiError.database(context, "Failed to validate user_id"));
    }

    if (result.length === 0) {
      return next(ApiError.notFound("User", "User ID does not exist"));
    }


    insertSettingsModels(user_id, theme, currency, language, notification, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
        return next(ApiError.validation(context, "Settings already exist for this user (duplicate user_id)."));
      }
        return next(ApiError.database(context, "Failed to insert settings"));
      }

      if (!result || typeof result.insertId === "undefined") {
        return next(ApiError.database(context, "Internal Server Error"));
      }

      createdResponse(res, { id: result.insertId }, "Settings created successfully");
    });
  });
};

export const updateSettingsControllers = (req, res, next) => {
  const { id } = req.params;
  const fields = req.body;
  if (Object.keys(fields).length === 0) {
    return next(ApiError.validation(context, "No fields provided to update"))
  }

  const forbiddenFields = ["setting_id", "user_id"];
    for (const key of Object.keys(fields)) {
      if (forbiddenFields.includes(key)) {
        return next(ApiError.validation(context, `Field '${key}' cannot be modified.`));
      }
    }

  updateSettingsModels(id, fields, (err, result) => {    
    if (err) return next(ApiError.database(context, "Update Error"));

    if (result.affectedRows === 0) {
      return next(ApiError.notFound(context, "Settings Not Found"));
    }

    successResponse(res, {updated_fields: Object.keys(fields)}, "Settings updated successfully");
  });
};

export const deleteSettingsControllers = (req, res, next) => {
  const { id } = req.params
    deleteSettingsModels(id , (err, result) => {
    if (err) {
      return next(ApiError.database(context, "Error Delete"))
    }
    if (!result || result.affectedRows === 0) {
          return next(ApiError.notFound(context, "Not Found"));
        }
    deletedResponse(res, "Settings Deleted", {id});
  });
};