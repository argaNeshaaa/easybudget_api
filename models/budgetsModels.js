import db from "../config/db.js";

export const findAllBudgetsModels = async () => {
  const query = `SELECT * FROM budgets`;
  const [rows] = await db.promise().query(query);

  return rows;
};

export const findBudgetsByIdModels = async (id) => {
  const query = `SELECT * FROM budgets WHERE budget_id = ?`;
  const [rows] = await db.promise().query(query, [id]);

  return rows[0];
};

export const findBudgetsByIdUserModels = async (userId) => {
  const query = `SELECT * FROM budgets WHERE user_id = ?`;
  const [rows] = await db.promise().query(query, [userId]);

  return rows;
};

export const insertBudgetsModels = async (
  userId,
  categoryId,
  amount,
  periodStart,
  periodEnd
) => {
  const query = `
    INSERT INTO budgets (user_id, category_id, amount, period_start, period_end, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
    `;
  const [result] = await db
    .promise()
    .query(query, [userId, categoryId, amount, periodStart, periodEnd]);

  return result;
};

export const updateBudgetsModels = async (id, fields) => {
  const updates = Object.keys(fields)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(fields);
  const query = `UPDATE budgets SET ${updates} WHERE budget_id = ?`;
  const [result] = await db.promise().query(query, [...values, id]);

  return result;
};

export const deleteBudgetsModels = async (id) => {
  const query = `DELETE FROM budgets WHERE budget_id = ?`;
  const [result] = await db.promise().query(query, [id]);

  return result;
};
