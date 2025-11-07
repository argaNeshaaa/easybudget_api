import db from "../config/db.js";

export const findAllSettingsModels = async () => {
  const query = `SELECT * FROM settings`;
  const [rows] = await db.promise().query(query);

  return rows;
};

export const findSettingsByUserIdModels = async (id) => {
  const query = `SELECT * FROM settings WHERE user_id = ?`;
  const [rows] = await db.promise().query(query, [id]);

  return rows[0];
};

export const insertSettingsModels = async (
  user_id,
  theme,
  currency,
  language,
  notification
) => {
  const query = `
  INSERT INTO settings (user_id, theme, currency, language, notification)
  VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await db
    .promise()
    .query(query, [user_id, theme, currency, language, notification]);

  return result;
};

export const updateSettingsModels = async (id, fields) => {
  const updates = Object.keys(fields)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(fields);
  const query = `UPDATE settings SET ${updates} WHERE user_id = ?`;
  const [result] = await db.promise().query(query, [...values, id]);

  return result;
};

export const deleteSettingsModels = async (user_id) => {
  const query = "DELETE FROM settings WHERE user_id = ?";
  const [result] = await db.promise().query(query, [user_id]);

  return result;
};
