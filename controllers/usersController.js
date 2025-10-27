import db from "../config/db.js";
import ApiError from "../utils/ApiError.js"; 
import bcrypt from "bcryptjs";
let context = 'User';

// GET /api/users
export const getAllUsers = (req, res, next) => {
  const query = `SELECT * FROM users`;
  db.query(query, (err, result) => {
    if (err) {
      return next(ApiError.database(context, internalServerError))
    }
    res.status(200).json({
      status: "succes",
      data: result,
    });
  });
};

// GET /api/users/:id
export const getUserById = (req, res, next) => {
  const { id } = req.params;
  const query = `SELECT * FROM users WHERE user_id = ?`;
  db.query(query, [id], (err, result) => {
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

// POST /api/users
export const createUser = async (req, res, next) => {
  const query = `
    INSERT INTO users (name, email, password, role, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(query, [name, email, hashedPassword, role], (err, result) => {
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

//PATCH api/users/:id
export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const fields = req.body;

  if (!Object.keys(fields).length) {
    return next(ApiError.validation(context, "No fields provided for update."));
  }

  const forbiddenFields = ["user_id", "email", "created_at", "updated_at", "role"];
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

    db.query(query, [...values, id], (err, result) => {
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

//DELETE /api/users/:id
export const deleteUser = (req, res, next) => {
  const {id} = req.params;
  const query = `DELETE FROM users WHERE user_id = ?`;
  db.query(query, [id], (err, result) => {
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