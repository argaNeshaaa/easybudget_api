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
    
    // 1. Ambil data user lama
    const oldUser = await findUserByIdService(id);

    // 2. Jika ada file foto baru yang diupload
    if (req.file) {
      // --- PERBAIKAN DI SINI (SAFE DELETE) ---
      // Cek apakah user punya public_id DAN itu bukan URL (kadang data Google nyangkut sebagai URL)
      if (oldUser.photo_public_id && !oldUser.photo_public_id.startsWith("http")) {
        try {
          await cloudinary.uploader.destroy(oldUser.photo_public_id);
        } catch (err) {
          console.error("Gagal hapus foto lama Cloudinary (diabaikan):", err);
          // Kita abaikan error delete, agar user tetap bisa upload foto baru
        }
      }

      // 3. Upload foto baru
      const upload = await cloudinaryUpload(req.file.buffer, "users");
      fields.photo_url = upload.secure_url;
      fields.photo_public_id = upload.public_id;
    }

    // 4. Update data di database
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
