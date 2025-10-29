import db from "../config/db.js";

export const findAllUsers = (callback) => {
  const query = `SELECT * FROM users`;
  db.query(query, callback);
};

export const findUserById = (id, callback) => {
  const query = `SELECT * FROM users WHERE user_id = ?`;
  db.query(query, [id], callback);
};

export const insertUser = (name, email, hashedPassword, role, callback) => {
  const query = `
    INSERT INTO users (name, email, password, role, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;
  db.query(query, [name, email, hashedPassword, role], callback);
};

export const updateUserById = (id, fields, callback) => {
  const updates = Object.keys(fields).map(key => `${key} = ?`).join(", ");
  const values = Object.values(fields);
  const query = `UPDATE users SET ${updates}, updated_at = NOW() WHERE user_id = ?`;
  db.query(query, [...values, id], callback);
};

export const deleteUserById = (id, callback) => {
  const query = `DELETE FROM users WHERE user_id = ?`;
  db.query(query, [id], callback);
};
