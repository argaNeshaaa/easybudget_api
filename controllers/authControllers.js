import { requestOtpService, verifyOtpService, resetPasswordService } from "../services/authServices.js";

// ... login controller yang lama ...

export const forgotPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;
    await requestOtpService(email);
    res.status(200).json({ status: "success", message: "OTP telah dikirim ke email Anda" });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

export const verifyOtpController = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    await verifyOtpService(email, otp);
    res.status(200).json({ status: "success", message: "OTP Valid" });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    await resetPasswordService(email, otp, newPassword);
    res.status(200).json({ status: "success", message: "Password berhasil diubah. Silakan login." });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};