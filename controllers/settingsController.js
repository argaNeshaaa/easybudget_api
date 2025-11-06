import ApiError from "../utils/ApiError.js";
import { deleteSettingsModels, findAllSettingsModels, findSettingsByUserIdModels, insertSettingsModels, updateSettingsModels

 } from "../models/settingsModels.js";
 import { deleteSettingsServices, findAllSettingsServices, findSettingsByUserIdServices, insertSettingsServices, updateSettingsServices } from "../services/settingsServices.js";
import { findUserByIdService } from "../services/usersServices.js";
import { createdResponse, deletedResponse, successResponse } from "../utils/responseHandler.js";

const context = "Settings";

export const findAllSettingsControllers = async (req, res, next) => {
  try {
    const result = await findAllSettingsServices();

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findSettingsByUserIdControllers = async (req, res, next) => {
  try {
    const {id} = req.params;
    const result = await findSettingsByUserIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const insertSettingsControllers = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id;
    const { theme, currency, language, notification } = req.body;
    const result = await insertSettingsServices(user_id, theme, currency, language, notification);

    createdResponse(res, { id: result.insertId }, "Settings created successfully");
  } catch (error) {
    next(error);
  }
};

export const updateSettingsControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const result = await updateSettingsServices(id, fields);

    successResponse(res, result, "Setting Updated Succesfully");
  } catch (error) {
    next(error);
  }
};

export const deleteSettingsControllers = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await deleteSettingsServices(id);

    deletedResponse(res, "Settings deleted succesfully", {id});
  } catch (error) {
    next(error);
  }
};