import db from "../config/db.js";
import ApiError from "../utils/ApiError.js"; 
import bcrypt from "bcryptjs";
import {
  findAllUsers,
  findUserById,
  insertUser,
  updateUserById,
  deleteUserById,
} from "../models/userModels.js";

let context = 'User';

export const getAllUsers = (req, res, next) => {
  findAllUsers((err,result) => {
    if (err) {
      return next(ApiError.database(context, internalServerError))
    }
    res.status(200).json({
      status: "success",
      data: result,
    });
  });
};

export const getUserById = (req, res, next) => {
  const { id } = req.params;
  findUserById(id, (err, result) => {
    if (err) {
      return next(ApiError.database(context, internalServerError));
    }

    if (result.length === 0) {
      return next(ApiError.notFound(context, "notFound"));
    }

    res.status(200).json({
      status: "success",
      data: result[0],
    });
  });
};

export const createUser = async (req, res, next) => {
  const { name, email, password, account_type } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  insertUser(name, email, hashedPassword, account_type ,(err, result) => {
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

    res.status(201).json({ 
      status: "success",
      message: "User Created", 
      user_id: result.insertId 
    });
  });
};

export const updateUser = async (req, res, next) => {
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

    const updates = Object.keys(fields).map(key => `${key} = ?`).join(", ");
    const values = Object.values(fields);
    const query = `UPDATE users SET ${updates}, updated_at = NOW() WHERE user_id = ?`;

    updateUserById(id, fields, (err, result) => {
        if (err) return next(ApiError.database("User", err.message));

        if (result.affectedRows === 0) {
          return next(ApiError.notFound("User"));
        }

        res.status(200).json({
          status: "success",
          message: "User updated successfully",
          updated_fields: Object.keys(fields),
        });
      }
    );
  } catch (error) {
    next(ApiError.database("User", error.message));
  }
};

export const deleteUser = (req, res, next) => {
  const {id} = req.params;
  deleteUserById(id, (err, result) => {
    if (err) {
      return next(ApiError.database(context, "Fail Delete"))
    }
    if (!result || result.affectedRows === 0) {
      return next(ApiError.notFound(context, "notFound"));
    }
     res.status(200).json({
      status: "success",
      message: "User deleted successfully ✅",
    });
  });
};