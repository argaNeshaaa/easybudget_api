import db from "../config/db.js";

export const findAllBusinessesModels = async () => {
  const query = `SELECT * FROM businesses`;
  const [rows] = await db.promise().query(query);

  return rows;
};

export const findBusinessesByIdModels = async (id) => {
  const query = `SELECT * FROM businesses WHERE business_id = ?`;
  const [rows] = await db.promise().query(query, [id]);

  return rows[0];
};

export const findBusinessesByUserIdModels = async (userId) => {
  const query = `SELECT * FROM businesses WHERE user_id = ?`;
  const [rows] = await db.promise().query(query, [userId]);

  return rows;
};

export const insertBusinessesModels = async (
  userId,
  name,
  industry,
  address
) => {
  const query = `INSERT INTO businesses (user_id, name, industry, address, created_at) 
    VALUES (?, ?, ?, ?, NOW())`;
  const [result] = await db
    .promise()
    .query(query, [userId, name, industry, address]);

  return result;
};

export const updateBusinessesModels = async (id, fields) => {
  const updates = Object.keys(fields)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(fields);
  const query = `UPDATE businesses SET ${updates} WHERE business_id = ?`;
  const [result] = await db.promise().query(query, [...values, id]);

  return result;
};

export const deleteBusinessesModels = async (id) => {
  const query = `DELETE FROM businesses WHERE business_id = ?`;
  const [result] = await db.promise().query(query, [id]);

  return result;
};
