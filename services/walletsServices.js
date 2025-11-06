import { deleteWalletsModels, findAllWalletsModels, findWalletsByIdModels, findWalletsByUserIdModels, insertWalletsModels, updateWalletsModels } from "../models/walletsModels.js";
import ApiError from "../utils/ApiError.js";


let context = "Wallets";

export const findAllWalletsServices = async() => {
    try {
        const result = await findAllWalletsModels();

        return result;
    } catch (error) {
        throw ApiError.database(context);
    }
}

export const findWalletsByIdServices = async(id) => {
    try {
        const result = await findWalletsByIdModels(id);

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
}

export const findWalletsByUserIdServices = async(id) => {
    try {
        const result = await findWalletsByUserIdModels(id);
        
        if (result.length === 0) {
            throw ApiError.notFound(context, "notFound");
        };

        return result;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        
        throw ApiError.database(context);     
    }
};

export const insertWalletsServices = async(idUser, name, type, balance, currency) => {
    try {
        const result = await insertWalletsModels(idUser, name, type, balance, currency);
        
        if (!result || typeof result.insertId === "undefined") {
            throw ApiError.database(context);
        }

        return result;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        
        if (error.code === "ER_DUP_ENTRY") {
            context = "User ID";
            throw ApiError.duplicate(context);
        }
        throw ApiError.database(context);
    }
};

export const updateWalletsServices = async(id, fields) => {
    try {
        if (!Object.keys(fields).length) {
            throw ApiError.validation(context);
        }
        
        const fieldsToUpdate = { ...fields };

        const forbiddenFields = ["wallet_id", "user_id", "created_at", "updated_at"];
        for (const key of Object.keys(fields)) {
            if (forbiddenFields.includes(key)) {
                throw ApiError.validation(context, `Field '${key}' cannot be modified.`);
            }
        }

        const result = await updateWalletsModels(id, fieldsToUpdate);

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

export const deleteWalletsServices = async (id) => {
    try {
        const result = await deleteWalletsModels(id);

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
} 