import ApiError from "../utils/ApiError.js";
import { findWalletsByIdModels } from "../models/walletsModels.js";

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

      if (tableName === "wallets") {
        const result = await findWalletsByIdModels(recordId);

        if (!result) {
          return next(ApiError.notFound("Wallet not found"));
        }

        const walletOwnerId = result.user_id;
        if (walletOwnerId === userId) {
          return next();
        }

        return next(
          ApiError.forbidden("You don't have permission to access this wallet")
        );
      }
      return next(ApiError.forbidden("Access not defined for this resource."));
    } catch (error) {
      return next(
        ApiError.database("Authorization erroraa", "internalServerError")
      );
    }
  };
};
