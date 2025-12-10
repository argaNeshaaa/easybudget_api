import { deleteProfileServices, findProfileByUserServices, insertProfileServices } from "../services/profileServices.js";
import {
  createdResponse,
  deletedResponse,
  successResponse,
} from "../utils/responseHandler.js";

export const findProfileByUserController = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const result = await findProfileByUserServices(userId);

        successResponse(res, result);
    } catch (error) {
        next(error);
    }
};

export const insertProfileController = async (req, res, next) => {
    try {
        const { pekerjaan, id_penghasilan, pendapatan_bulanan } = req.body;
        const idUser = req.user?.user_id;
        const result = await insertProfileServices(idUser, pekerjaan, id_penghasilan, pendapatan_bulanan)

        createdResponse(res,{ id: result.insertId },"Profile created successfully");
    } catch (error) {
        next(error);
    }
};

export const updateProfileController = async (req, res, next) => {
  try {
    const id  = req.user?.user_id;
    const fields = req.body;
    const result = await updateWalletsServices(id, fields);

    successResponse(res, result, "Profile updated Succesfully");
  } catch (error) {
    next(error);
  }
};

export const deleteProfileController = async (req, res, next) => {
    try  {
        const idUser = req.user?.user_id;
        const result = await deleteProfileServices(idUser);

        deletedResponse(res, "Profile deleted succesfully", { idUser });
    } catch (error) {
        next(error);
    }
};