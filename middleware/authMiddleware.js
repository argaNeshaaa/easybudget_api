import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(ApiError.unauthorized());
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // simpan data user di request
    next(); // lanjut ke controller berikutnya
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
