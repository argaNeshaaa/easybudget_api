import db from "../config/db.js";

export const findAllBudgetsModels = async () => {
  const query = `SELECT * FROM budgets`;
  const [rows] = await db.query(query);

  return rows;
};

export const findBudgetsByIdModels = async (id) => {
  const query = `SELECT * FROM budgets WHERE budget_id = ?`;
  const [rows] = await db.query(query, [id]);

  return rows[0];
};

export const findBudgetsByIdUserModels = async (userId) => {
  const query = `
    SELECT 
      b.budget_id,
      b.category_id,
      b.amount as limit_amount,
      b.period_start,
      b.period_end,
      c.name as category_name,
      c.icon as category_icon,
      -- Hitung total pengeluaran (expense) yang sesuai kategori & periode budget
      COALESCE(SUM(t.amount), 0) as used_amount
    FROM budgets b
    JOIN categories c ON b.category_id = c.category_id
    LEFT JOIN transactions t ON 
      b.category_id = t.category_id 
      AND t.type = 'expense'
      AND t.date BETWEEN b.period_start AND b.period_end
    WHERE b.user_id = ?
    GROUP BY 
      b.budget_id, 
      b.category_id, 
      b.amount, 
      b.period_start, 
      b.period_end, 
      c.name, 
      c.icon
    ORDER BY b.created_at DESC
  `;
  
  const [rows] = await db.query(query, [userId]);
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
  const [result] = await db.query(query, [...values, id]);

  return result;
};

export const deleteBudgetsModels = async (id) => {
  const query = `DELETE FROM budgets WHERE budget_id = ?`;
  const [result] = await db.query(query, [id]);

  return result;
};
