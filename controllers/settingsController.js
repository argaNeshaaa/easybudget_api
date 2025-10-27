import db from "../config/db.js";
import ApiError from "../utils/ApiError.js";

const context = "Settings";

// GET /api/settings
export const getAllSettings = (req, res, next) => {
  const query  = `SELECT * FROM settings`
  db.query(query, (err, result) => {
    if (err) {
      return next(ApiError.database(context,"Fail GET"))
    }
    res.status(200).json({
      status: "success",
      data: result,
    });
  });
};

// GET /api/settings/id
export const getSettingsById = (req, res, next) => {
    const { id } = req.params;
    const query = `SELECT * FROM settings WHERE setting_id = ?`;
    db.query(query, [id], (err, result) => {
      if (err) {
        return next(ApiError.database(context, internalServerError));
      }
  
      if (result.length === 0) {
        return next(ApiError.notFound(context, "notFound"));
      }
  
      res.status(200).json({
        status: "success",
        data: result[0],
      });
  });
};

export const getSettingsByUserID = (req, res, next) => {
  const {user_id} = req.params;
  const query = `SELECT * FROM settings WHERE user_id = ?`;
  db.query(query, [user_id], (err, result) => {
    if (err) {
        return next(ApiError.database(context, internalServerError));
      }
  
      if (result.length === 0) {
        return next(ApiError.notFound(context, "notFound"));
      }
  
      res.status(200).json({
        status: "success",
        data: result[0],
      });
  });
};
//POST /api/settings
export const createSettings = (req, res, next) => {
  const { user_id, theme, currency, language, notification } = req.body;
  const checkUserQuery = "SELECT user_id FROM users WHERE user_id = ?";
  db.query(checkUserQuery, [user_id], (err, result) => {
    if (err) {
      return next(ApiError.database(context, "Failed to validate user_id"));
    }

    if (result.length === 0) {
      return next(ApiError.notFound("User", "User ID does not exist"));
    }

    const insertQuery = `
      INSERT INTO settings (user_id, theme, currency, language, notification)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [user_id, theme, currency, language, notification], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
        return next(ApiError.validation(context, "Settings already exist for this user (duplicate user_id)."));
      }
        return next(ApiError.database(context, "Failed to insert settings"));
      }

      if (!result || typeof result.insertId === "undefined") {
        return next(ApiError.database(context, "Internal Server Error"));
      }

      res.status(201).json({
        status: "success",
        message: "Settings created successfully",
        settings_id: result.insertId,
      });
    });
  });
};

//PACTH Settings
export const updateSettingPartial = (req, res, next) => {
  const { id } = req.params;
  const fields = req.body;

  if (Object.keys(fields).length === 0) {
    return next(ApiError.validation(context, "No fields provided to update"))
  }

  const forbiddenFields = ["setting_id", "user_id"];
    for (const key of Object.keys(fields)) {
      if (forbiddenFields.includes(key)) {
        return next(ApiError.validation(context, `Field '${key}' cannot be modified.`));
      }
    }

  const updates = Object.keys(fields).map(key => `${key} = ?`).join(", ");
  const values = Object.values(fields);
  const query = `UPDATE settings SET ${updates} WHERE setting_id = ?`;

  db.query(query, [...values, id], (err, result) => {
    if (err) return next(ApiError.database(context, "Update Error"));

    if (result.affectedRows === 0) {
      return next(ApiError.notFound(context, "Settings Not Found"));
    }

    res.status(200).json({
          status: "success",
          message: "Settings updated successfully",
          updated_fields: Object.keys(fields),
        });
  });
};

// DELETE Settings
export const deleteSettings = (req, res) => {
  const { id } = req.params
    const query = 'DELETE FROM settings WHERE setting_id = ?';
    db.query(query,[id], (err, result) => {
    if (err) return res.status(500).json({ message: "Delete error", error: err });
    res.json({ message: "Settings Deleted", transaction_id: result.insertId });
  });
};