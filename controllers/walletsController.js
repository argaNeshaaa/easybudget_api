import ApiError from "../utils/ApiError.js";
import {
  insertWalletsModels,
  updateWalletsModels,
  deleteWalletsModels,
} from "../models/walletsModels.js";
import {
  successResponse,
  createdResponse,
  deletedResponse,
} from "../utils/responseHandler.js";
import {
  deleteWalletsServices,
  findAllWalletsServices,
  findWalletsByIdServices,
  findWalletsByUserIdServices,
  insertWalletsServices,
  updateWalletsServices,
} from "../services/walletsServices.js";
let context = "Wallet";

export const findAllWalletsControllers = async (req, res, next) => {
  try {
    const result = await findAllWalletsServices();

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findWalletsByIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findWalletsByIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findWalletsByUserIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findWalletsByUserIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const insertWalletsControllers = async (req, res, next) => {
  try {
    const { name, type, currency } = req.body;
    const idUser = req.user?.user_id;
    const result = await insertWalletsServices(
      idUser,
      name,
      type,
      currency
    );

    createdResponse(
      res,
      { id: result.insertId },
      "Wallet created successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const updateWalletsControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const result = await updateWalletsServices(id, fields);

    successResponse(res, result, "Wallet updated Succesfully");
  } catch (error) {
    next(error);
  }
};

export const deleteWalletsControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteWalletsServices(id);

    deletedResponse(res, "Wallets deleted succesfully", { id });
  } catch (error) {
    next(error);
  }
};
