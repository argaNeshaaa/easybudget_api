import ApiError from "../utils/ApiError.js";
import db from "../config/db.js";
import { checkUserByWalletModels } from "../models/walletsModels.js";
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    const userId = req.user?.user_id;
    const paramId = parseInt(req.params.id);

    if (!userRole) {
      return next(ApiError.unauthorized("No role information found"));
    }

    if (allowedRoles.includes(userRole)) {
      return next();
    }

    if (paramId && userId === paramId) {
      return next();
    }

    return next(ApiError.forbidden("You don't have permission to access this resource")); 
  };
};

export const authorizeWalletAccess = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    const userId = req.user?.user_id;
    const walletId = parseInt(req.params.id);

    if (!userRole) {
      return next(ApiError.unauthorized("No role information found"));
    }

    // Jika admin, langsung lolos
    if (allowedRoles.includes(userRole)) {
      return next();
    }

    // Jika bukan admin, cek apakah wallet milik user
    checkUserByWalletModels(walletId, (err, result) => {
      if (err) return next(ApiError.database("Error checking wallet owner"));
      if (result.length === 0) return next(ApiError.notFound("Wallet not found"));

      const walletOwnerId = result[0].user_id;

      if (walletOwnerId === userId) {
        return next();
      }

      return next(ApiError.forbidden("You don't have permission to access this wallet"));
    });
  };
};
