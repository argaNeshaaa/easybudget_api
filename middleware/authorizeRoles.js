import ApiError from "../utils/ApiError.js";

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
