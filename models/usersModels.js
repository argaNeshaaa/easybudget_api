import db from "../config/db.js";

export const findAllUsersModels = (callback) => {
  const query = `SELECT * FROM users`;
  db.query(query, callback);
};

export const findUserByIdModels = (id, callback) => {
  const query = `SELECT * FROM users WHERE user_id = ?`;
  db.query(query, [id], callback);
};

export const insertUserModels = (name, email, hashedPassword, accountType,roleId, callback) => {
  const query = `
    INSERT INTO users (name, email, password, account_type, role_id, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;
  db.query(query, [name, email, hashedPassword, accountType, roleId], callback);
};

export const updateUserModels = (id, fields, callback) => {
  const updates = Object.keys(fields).map(key => `${key} = ?`).join(", ");
  const values = Object.values(fields);
  const query = `UPDATE users SET ${updates}, updated_at = NOW() WHERE user_id = ?`;
  db.query(query, [...values, id], callback);
};

export const deleteUserModels = (id, callback) => {
  const query = `DELETE FROM users WHERE user_id = ?`;
  db.query(query, [id], callback);
};
