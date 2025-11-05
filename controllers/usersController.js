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
import { deleteUserServices, findAllUsersServices, findUserByIdService, insertUserServices, updateUserServices } from "../services/usersServices.js";

let context = 'User';

export const findAllUsersControllers = async (req, res, next) => {
  try {
    const result = await findAllUsersServices();

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};


export const findUserByIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findUserByIdService(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const insertUserControllers = async (req, res, next) => {
  try {
    const { name, email, password, account_type, role_id } = req.body;
    const result = await insertUserServices(name, email, password, account_type , role_id);
    
    createdResponse(res, { id: result.insertId }, "User created successfully");
  } catch (error) {
    next(error);
  }
};

export const updateUserControllers = async (req, res, next) => {
  try {
  const { id } = req.params;
  const fields = req.body;
  const result = await updateUserServices(id, fields);
  
  successResponse(res, result, "User updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteUserControllers = async (req, res, next) => {
  try {
    const {id} = req.params;
    const result = await deleteUserServices(id);

    deletedResponse(res,"User deleted successfully", {id});
  } catch (error) {
    next(error);
  }
};