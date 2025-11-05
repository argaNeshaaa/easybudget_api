import { deleteSettingsModels, findAllSettingsModels, findSettingsByUserIdModels, insertSettingsModels, updateSettingsModels } from "../models/settingsModels.js";
import ApiError from "../utils/ApiError.js";
import { findUserByIdService } from "./usersServices.js";

let context = "Setting";

export const findAllSettingsServices = async() => {
    try {
        const result = await findAllSettingsModels();

        return result;
    } catch (error) {
        throw ApiError.database(context);
    }
};

export const findSettingsByUserIdServices = async(user_id) => {
    try {
        const result = await findSettingsByUserIdModels(user_id);
        
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

export const insertSettingsServices = async (user_id, theme, currency, language, notification) => {
    try {
        const user = await findUserByIdService(user_id);
        if (!user) throw ApiError.notFound("User");
        const result = await insertSettingsModels(user_id, theme, currency, language, notification);

        if (!result || typeof result.insertId === "undefined") {
            throw ApiError.database(context);
        }

        return result;
    } catch (error){
        if (error instanceof ApiError) {
            throw error;
        }

        if (error.code === "ER_DUP_ENTRY") {
            throw ApiError.duplicate(context, "Settings already exist for this user");
        }

        throw ApiError.database(context);
    }
};

export const updateSettingsServices = async (id, fields) => {
    try {
        if (!Object.keys(fields).length) {
            throw ApiError.validation(context);
        }
        
        const fieldsToUpdate = { ...fields };

        const forbiddenFields = ["setting_id", "user_id"];
        for (const key of Object.keys(fields)) {
            if (forbiddenFields.includes(key)) {
                throw ApiError.validation(context, `Field '${key}' cannot be modified.`);
            }
        }

        const result = await updateSettingsModels(id, fieldsToUpdate);

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

export const deleteSettingsServices = async (id) => {
    try {
        const result = await deleteSettingsModels(id);

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