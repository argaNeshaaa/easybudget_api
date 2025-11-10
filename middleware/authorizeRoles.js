import ApiError from "../utils/ApiError.js";
import { findWalletsByIdModels } from "../models/walletsModels.js";
import { findAccountsByIdModels } from "../models/accountsModels.js";
import { findUserIdForAuthorizeServices } from "../services/AuthorizeRolesServices.js";

export const authorizeRoles = (...allowedRoles) => {
  const tableName = allowedRoles.pop();
  const roles = allowedRoles;

  return async (req, res, next) => {
    try {
      const userRole = req.user?.role;
      const userId = req.user?.user_id;
      const recordId = parseInt(req.params.id);

      if (!userRole) {
        return next(ApiError.unauthorized("No role information found"));
      }

      if (roles.includes(userRole)) {
        return next();
      }

      if (tableName === "general") {
        return next(
          ApiError.forbidden(
            "You don't have permission to access this general."
          )
        );
      }

      if (tableName === "users") {
        if (recordId === userId) {
          return next();
        }
        return next(
          ApiError.forbidden("You don't have permission to access this user")
        );
      }
      const result = await findUserIdForAuthorizeServices(recordId, tableName);
      if (result.user_id === userId) return next();
      return next(
        ApiError.forbidden("You don't have permission to access this Resource")
      );
    } catch (error) {
      if (error instanceof ApiError) {
        next(error);
      }
      return next(ApiError.database("Authorization error"));
    }
  };
};
