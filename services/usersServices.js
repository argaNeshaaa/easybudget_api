import {
  findAllUsersModels,
  findUserByIdModels,
  insertUserModels,
  updateUserModels,
  deleteUserModels,
} from "../models/usersModels.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcryptjs";

let context = "User";

export const findAllUsersServices = async () => {
  try {
    const result = await findAllUsersModels();

    return result;
  } catch (error) {
    throw ApiError.database(context);
  }
};

export const findUserByIdService = async (id) => {
  try {
    const result = await findUserByIdModels(id);

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
};

export const insertUserServices = async (
  name,
  email,
  password,
  account_type,
  role_id
) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await insertUserModels(
      name,
      email,
      hashedPassword,
      account_type,
      role_id
    );

    if (!result || typeof result.insertId === "undefined") {
      throw ApiError.database(context);
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error.code === "ER_DUP_ENTRY") {
      context = "Email";
      throw ApiError.duplicate(context);
    }
    throw ApiError.database(context);
  }
};

export const updateUserServices = async (id, fields) => {
  try {
    if (!Object.keys(fields).length) {
      throw ApiError.validation(context);
    }

    const fieldsToUpdate = { ...fields };

    if (fieldsToUpdate.password) {
      const hashedPassword = await bcrypt.hash(fieldsToUpdate.password, 10);
      fieldsToUpdate.password = hashedPassword;
    }

    const forbiddenFields = [
      "user_id",
      "email",
      "account_type",
      "created_at",
      "role_id",
    ];
    for (const key of Object.keys(fields)) {
      if (forbiddenFields.includes(key)) {
        throw ApiError.validation(
          context,
          `Field '${key}' cannot be modified.`
        );
      }
    }

    const result = await updateUserModels(id, fieldsToUpdate);

    if (result.affectedRows === 0) {
      throw ApiError.notFound(context);
    }

    const updated_fields = Object.keys(fields).filter(
      (key) => key !== "password"
    );
    if (fields.password) updated_fields.push("password");

    return { updated_fields: updated_fields };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.database(context);
  }
};

export const deleteUserServices = async (id) => {
  try {
    const result = await deleteUserModels(id);

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
};
