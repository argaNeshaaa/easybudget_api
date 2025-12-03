import { chatWithAIService } from "../services/aiServices.js";
import { successResponse } from "../utils/responseHandler.js";

export const chatControllers = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { message } = req.body; // Pesan dari user

    if (!message) {
      throw new Error("Pesan tidak boleh kosong");
    }

    const reply = await chatWithAIService(userId, message);

    successResponse(res, { reply });
  } catch (error) {
    next(error);
  }
};