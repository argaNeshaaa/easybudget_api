import {
  successResponse,
  createdResponse,
  deletedResponse,
} from "../utils/responseHandler.js";
import {
  deleteUserServices,
  findAllUsersServices,
  findUserByIdService,
  insertUserServices,
  updateUserServices,
} from "../services/usersServices.js";
import cloudinary from "../config/cloudinary.js";
import {cloudinaryUpload} from "../utils/cloudinaryUpload.js"
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
    const { name, email, password, account_type } = req.body;

    let photoUrl = null;
    let publicId = null;

    if (req.file) {
      const uploaded = await cloudinaryUpload(req.file.buffer);
      photoUrl = uploaded.secure_url;
      publicId = uploaded.public_id;
    }
    const result = await insertUserServices(
      name,
      email,
      password,
      account_type,
      photoUrl,
      publicId
    );

    createdResponse(res, { id: result.insertId }, "User created successfully");
  } catch (error) {
    next(error);
  }
};

export const updateUserControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;
        // Ambil user lama (untuk delete image jika ada file baru)
    const oldUser = await findUserByIdService(id);

    // Jika ada file baru
    if (req.file) {
      // Hapus foto lama jika ada
      if (oldUser.photo_public_id) {
        await cloudinary.uploader.destroy(oldUser.photo_public_id);
      }

      // Upload foto baru
      const upload = await cloudinaryUpload(req.file.buffer, "users");
      fields.photo_url = upload.secure_url;
      fields.photo_public_id = upload.public_id;
    }

    const result = await updateUserServices(id, fields);

    successResponse(res, result, "User updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteUserControllers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteUserServices(id);

    deletedResponse(res, "User deleted successfully", { id });
  } catch (error) {
    next(error);
  }
};
