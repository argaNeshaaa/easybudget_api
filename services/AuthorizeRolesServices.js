import { findUserIdForAuthorizeModels } from "../models/authorizeRolesModels.js";
import ApiError from "../utils/ApiError.js";

let context = "Authorize Roles";

export const findUserIdForAuthorizeServices = async (recordId, tableName) => {
    try {
        const result = await findUserIdForAuthorizeModels(recordId, tableName);
        
        if (!result || result.length === 0) {
            throw ApiError.notFound(tableName);
        }
        return result;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        console.log(error);
        throw ApiError.database(context);
  }
};