import db from "../config/db.js";
import ApiError from "../utils/ApiError.js"; 
import bcrypt from "bcryptjs";
import {
  findAllUsersModels,
  findUserByIdModels,
  insertUserModels,
  updateUserModels,
  deleteUserModels,
} from "../models/usersModels.js";
import { successResponse, createdResponse, deletedResponse } from "../utils/responseHandler.js";

let context = 'User';

export const findAllUsersControllers = (req, res, next) => {
  findAllUsersModels((err,result) => {
    if (err) {
      return next(ApiError.database(context, internalServerError))
    }
    successResponse(res, result);
  });
};

export const findUserByIdControllers = (req, res, next) => {
  const { id } = req.params;
  findUserByIdModels(id, (err, result) => {
    if (err) {
      return next(ApiError.database(context, internalServerError));
    }

    if (result.length === 0) {
      return next(ApiError.notFound(context, "notFound"));
    }

    successResponse(res, result);
  });
};

export const insertUserControllers = async (req, res, next) => {
  const { name, email, password, account_type, role_id } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  insertUserModels(name, email, hashedPassword, account_type , role_id, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        context = "Email";
        return next(ApiError.duplicate(context, "duplicate"));
      }
      return next(ApiError.database(context, "internalServerError"));
    }

    if (!result || typeof result.insertId === 'undefined') {
      return next(ApiError.database(context, "internalServerError"));
    }

    createdResponse(res, { id: result.insertId }, "User created successfully");
  });
};

export const updateUserControllers = async (req, res, next) => {
  const { id } = req.params;
  const fields = req.body;

  if (!Object.keys(fields).length) {
    return next(ApiError.validation(context, "No fields provided for update."));
  }

  const forbiddenFields = ["user_id", "email", "created_at", "updated_at", "account_type"];
  for (const key of Object.keys(fields)) {
    if (forbiddenFields.includes(key)) {
      return next(ApiError.validation(context, `Field '${key}' cannot be modified.`));
    }
  }

  try {
    if (fields.password) {
      const salt = await bcrypt.genSalt(10);
      fields.password = await bcrypt.hash(fields.password, salt);
    }

    updateUserModels(id, fields, (err, result) => {
        if (err) return next(ApiError.database("User", err.message));

        if (result.affectedRows === 0) {
          return next(ApiError.notFound("User"));
        }

        successResponse(res, {updated_fields: Object.keys(fields)}, "User updated successfully");
      }
    );
  } catch (error) {
    next(ApiError.database("User", error.message));
  }
};

export const deleteUserControllers = (req, res, next) => {
  const {id} = req.params;
  deleteUserModels(id, (err, result) => {
    if (err) {
      return next(ApiError.database(context, "Fail Delete"))
    }
    if (!result || result.affectedRows === 0) {
      return next(ApiError.notFound(context, "Not Found"));
    }
    deletedResponse(res, "User deleted successfully", {id});
  });
};