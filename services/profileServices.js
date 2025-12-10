import { deleteProfileModels, findProfileByUserModels, insertProfileModels, updateProfileModels } from "../models/profileModels.js";
import ApiError from "../utils/ApiError.js";

export const findProfileByUserServices = async (id) => {
    try {
        const result = await findProfileByUserModels(id);
        return result;
    } catch (error) {
        throw ApiError.database("Failed to fetch Profile");
    }
}

export const insertProfileServices = async (userId, job, idFlow, moneyMonth) => {
    try {
        const result = await insertProfileModels(userId, job, idFlow, moneyMonth);

        return result;
    } catch (error) {
        throw ApiError.database("Failed to Insert Profile");
    }
}

export const updateProfileServices = async (id, fields) => {
    try {
        if (!Object.keys(fields).length) {
          throw ApiError.validation(context);
        }
    
        const fieldsToUpdate = { ...fields };
    
        const forbiddenFields = [
          "id_profile",
          "user_id",
          "created_at",
        ];
        for (const key of Object.keys(fields)) {
          if (forbiddenFields.includes(key)) {
            throw ApiError.validation(
              context,
              `Field '${key}' cannot be modified.`
            );
          }
        }
    
        const result = await updateProfileModels(id, fieldsToUpdate);
    
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

    export const deleteProfileServices = async (id) => {
        try {
            const result = await deleteProfileModels(id);
            return result;
        } catch (error) {
            throw ApiError.database("Failed to Delete Profile");
        } 
    }