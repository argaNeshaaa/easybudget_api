import ApiError from "../utils/ApiError.js";
import db from "../config/db.js";
import { checkUserByWalletModels } from "../models/walletsModels.js";

export const authorizeRoles = (...allowedRoles) => {
  const tableName = allowedRoles.pop(); // argumen terakhir = nama tabel
  const roles = allowedRoles;           // sisanya = role yang diizinkan

  return async (req, res, next) => {
    try {
      const userRole = req.user?.role;
      const userId = req.user?.user_id;
      const recordId = parseInt(req.params.id);

      // Tidak ada informasi user
      if (!userRole) {
        return next(ApiError.unauthorized("No role information found"));
      }

      // Jika role diizinkan langsung lanjut
      if (roles.includes(userRole)) {
        return next();
      }

      if (tableName === "general") {
        return next(ApiError.forbidden("You don't have permission to access this general."));
      }

      // --- Jika role bukan admin, lakukan pengecekan tambahan ---
      if (tableName === "users") {
        // Hanya boleh akses datanya sendiri
        if (recordId === userId) {
          return next();
        }
        return next(ApiError.forbidden("You don't have permission to access this user"));
      }

      if (tableName === "wallets") {
        // Ambil owner dari wallet terkait
        const result = await new Promise((resolve, reject) => {
          checkUserByWalletModels(recordId, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });

        if (result.length === 0) {
          return next(ApiError.notFound("Wallet not found"));
        }

        const walletOwnerId = result[0].user_id;

        if (walletOwnerId === userId) {
          return next();
        }

        return next(ApiError.forbidden("You don't have permission to access this wallet"));
      }

      return next(ApiError.forbidden("You don't have permission to access this resource"));
    } catch (error) {
      return next(ApiError.database("Authorization error", "internalServerError"));
    }
  };
};
