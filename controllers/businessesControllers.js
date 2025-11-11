import {
  deleteBusinessesServices,
  findAllBusinessesServices,
  findBusinessesByIdServices,
  findBusinessesByUserIdServices,
  insertBusinessesServices,
  updateBusinessesServices,
} from "../services/businessesServices.js";
import {
  createdResponse,
  deletedResponse,
  successResponse,
} from "../utils/responseHandler.js";

export const findAllBusinessesControllers = async (req, res, next) => {
  try {
    const result = await findAllBusinessesServices();

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findBusinessesByIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findBusinessesByIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const findBusinessesByUserIdControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await findBusinessesByUserIdServices(id);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const insertBusinessesControllers = async (req, res, next) => {
  try {
    const {name, industry, address } = req.body;
    const user_id = req.user?.user_id;
    const result = await insertBusinessesServices(
      user_id,
      name,
      industry,
      address
    );

    createdResponse(
      res,
      { id: result.insertId },
      "Business Created Succesfully"
    );
  } catch (error) {
    next(error);
  }
};

export const updateBusinessesControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const result = await updateBusinessesServices(id, fields);

    successResponse(res, result, "Business Updated Succesfully");
  } catch (error) {
    next(error);
  }
};

export const deleteBusinessesControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteBusinessesServices(id);

    deletedResponse(res, "Bussiness Deleted Succesfully", { id });
  } catch (error) {
    next(error);
  }
};
