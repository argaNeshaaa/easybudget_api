import db from "../config/db.js";

export const findAllSettingsModels = (callback) => {
  const query = `SELECT * FROM settings`;
  db.query(query, callback);
};

export const findSettingsByUserIdModels = (id, callback) => {
  const query = `SELECT * FROM settings WHERE user_id = ?`;
  db.query(query, [id], callback);

}
export const checkUserQueryModels = (user_id, callback) => {
const query = `SELECT user_id FROM users WHERE user_id = ?`;
db.query(query, [user_id], callback);
}

export const insertSettingsModels = (user_id, theme, currency, language, notification, callback) => {
  const query = `
      INSERT INTO settings (user_id, theme, currency, language, notification)
      VALUES (?, ?, ?, ?, ?)
    `;
  db.query(query, [user_id, theme, currency, language, notification], callback);
}

export const updateSettingsModels = (id, fields, callback) => {
  const updates = Object.keys(fields).map(key => `${key} = ?`).join(", ");
  const values = Object.values(fields);
  const query = `UPDATE settings SET ${updates} WHERE user_id = ?`;
  db.query(query, [...values, id], callback);
}

export const deleteSettingsModels = (user_id, callback) => {
const query = 'DELETE FROM settings WHERE user_id = ?';
db.query(query, [user_id], callback);
}