import db from "../config/db.js";

export const findAllUsersModels = async () => {
  const query = `SELECT * FROM users`;
  const [rows] = await db.promise().query(query);

  return rows;
};

export const findUserByIdModels = async (id) => {
  const query = `SELECT * FROM users WHERE user_id = ?`;
  const [rows] = await db.promise().query(query, [id]);

  return rows[0];
};

export const insertUserModels = async (
  name,
  email,
  hashedPassword,
  accountType,
  roleId
) => {
  const query = `
  INSERT INTO users (name, email, password, account_type, role_id, created_at)
  VALUES (?, ?, ?, ?, ?, NOW())
  `;
  const [result] = await db
    .promise()
    .query(query, [name, email, hashedPassword, accountType, roleId]);

  return result;
};

export const updateUserModels = async (id, fields) => {
  const updates = Object.keys(fields)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(fields);
  const query = `UPDATE users SET ${updates}, updated_at = NOW() WHERE user_id = ?`;
  const [result] = await db.promise().query(query, [...values, id]);

  return result;
};

export const deleteUserModels = async (id) => {
  const query = `DELETE FROM users WHERE user_id = ?`;
  const [result] = await db.promise().query(query, [id]);

  return result;
};
