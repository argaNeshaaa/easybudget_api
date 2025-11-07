import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../config/db.js";
import ApiError from "../utils/ApiError.js";

let context;
export const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  db.query(
    `SELECT users.*, roles.name AS role_name
   FROM users
   JOIN roles ON users.role_id = roles.id
   WHERE users.email = ?`,
    [email],
    async (err, result) => {
      if (err) return next(err);
      if (result.length === 0) {
        context = "Email";
        return next(ApiError.notFound(context));
      }

      const user = result[0];

      // Verifikasi password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        context = "Password";
        return next(ApiError.unauthorized(context));
      }

      const token = jwt.sign(
        { user_id: user.user_id, email: user.email, role: user.role_name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role_name,
        },
      });
    }
  );
};
