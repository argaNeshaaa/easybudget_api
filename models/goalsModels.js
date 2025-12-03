import db from "../config/db.js";

export const findAllGoalsModels = async () => {
  const query = `SELECT * FROM goals`;
  const [rows] = await db.query(query);

  return rows;
};

export const findGoalsByIdModels = async (id) => {
  const query = `SELECT * FROM goals WHERE goal_id = ?`;
  const [rows] = await db.query(query, [id]);

  return rows[0];
};

export const findGoalsByUserIdModels = async (userId, status) => {
  let query = `SELECT * FROM goals WHERE user_id = ?`;
  const params = [userId];

  // Jika ada filter status, tambahkan kondisi WHERE
  if (status && ['ongoing', 'achieved', 'failed'].includes(status)) {
    query += ` AND status = ?`;
    params.push(status);
  }

  query += ` ORDER BY deadline ASC`;

  const [rows] = await db.query(query, params);
  return rows;
};

export const insertGoalsModels = async (
  userId,
  name,
  targetAmount,
  currentAmount,
  deadline,
  status
) => {
  const query = `INSERT INTO goals (user_id, name, target_amount, current_amount, deadline, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())`;
  const [result] = await db.query(query, [
      userId,
      name,
      targetAmount,
      currentAmount,
      deadline
    ]);

  return result;
};

export const updateGoalsModels = async (id, fields) => {
  const updates = Object.keys(fields)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(fields);
  const query = `UPDATE goals SET ${updates} WHERE goal_id = ?`;
  const [result] = await db.query(query, [...values, id]);

  return result;
};

export const addGoalAmountModel = async (id, amount) => {
  // Query ini akan menambah saldo yang ada, bukan me-replace
  const query = `
    UPDATE goals 
    SET current_amount = current_amount + ? 
    WHERE goal_id = ?
  `;
  const [result] = await db.query(query, [amount, id]);
  return result;
};

export const deleteGoalsModels = async (id) => {
  const query = `DELETE FROM goals WHERE goal_id = ?`;
  const [result] = await db.query(query, [id]);

  return result;
};
