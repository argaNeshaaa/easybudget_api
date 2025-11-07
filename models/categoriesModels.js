import db from "../config/db.js";

export const findAllCategoriesModels = async () => {
  const query = `SELECT * FROM categories`;
  const [rows] = await db.promise().query(query);

  return rows;
};

export const findCategoriesByIdModels = async (id) => {
  const query = `SELECT * FROM categories WHERE category_id = ?`;
  const [rows] = await db.promise().query(query, [id]);

  return rows[0];
};

export const findCategoriesByUserIdModels = async (userId) => {
  const query = `SELECT * FROM categories WHERE user_id = ?`;
  const [rows] = await db.promise().query(query, [userId]);

  return rows;
};

export const insertCategoriesModels = async (userId, name, type, icon) => {
  const query = `
    INSERT INTO categories (user_id, name, type, icon)
    VALUES (?, ?, ?, ?)
    `;
  const [result] = await db.promise().query(query, [userId, name, type, icon]);

  return result;
};

export const updateCategoriesModels = async (id, fields) => {
  const updates = Object.keys(fields)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(fields);
  const query = `UPDATE categories SET ${updates} WHERE category_id = ?`;
  const [result] = await db.promise().query(query, [...values, id]);

  return result;
};

export const deleteCategoriesModels = async (id) => {
  const query = `DELETE FROM categories WHERE category_id = ?`;
  const [result] = await db.promise().query(query, [id]);

  return result;
};
