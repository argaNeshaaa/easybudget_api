import db from "../config/db.js";

export const findAllTransactionsModels = async () => {
  const query = `SELECT * FROM transactions`;
  const [rows] = await db.query(query);

  return rows;
};

export const findTransactionsByIdModels = async (id) => {
  const query = `SELECT * FROM transactions WHERE transaction_id = ?`;
  const [rows] = await db.query(query, [id]);

  return rows[0];
};

export const findTransactionsByAccountIdModels = async (accountId) => {
  const query = `SELECT * FROM transactions WHERE account_id = ?`;
  const [rows] = await db.query(query, [accountId]);

  return rows;
};

export const findTransactionsByUserIdModels = async (userId, filters) => {
  // 1. Query Dasar (Join tetap diperlukan untuk filter by User ID)
  let query = `
    SELECT t.* FROM transactions t
    JOIN accounts a ON t.account_id = a.account_id
    JOIN wallets w ON a.wallet_id = w.wallet_id
    WHERE w.user_id = ?
  `;
  
  // Array untuk menyimpan value parameter (untuk mencegah SQL Injection)
  const queryParams = [userId];

  // 2. Tambahkan Filter TYPE (income/expense)
  if (filters.type) {
    query += ` AND t.type = ?`;
    queryParams.push(filters.type);
  }

  // 3. Tambahkan Filter MONTH
  if (filters.month) {
    query += ` AND MONTH(t.date) = ?`;
    queryParams.push(filters.month);
  }

  // 4. Tambahkan Filter YEAR
  if (filters.year) {
    query += ` AND YEAR(t.date) = ?`;
    queryParams.push(filters.year);
  }

  // 5. Order by Date (Opsional, biar rapi)
  query += ` ORDER BY t.date DESC`;

  // 6. Eksekusi Query
  const [rows] = await db.query(query, queryParams);

  return rows;
};

export const calculateTotalAmountModels = async (userId, type, month, year) => {
  const query = `
    SELECT COALESCE(SUM(t.amount), 0) as total_amount 
    FROM transactions t
    JOIN accounts a ON t.account_id = a.account_id
    JOIN wallets w ON a.wallet_id = w.wallet_id
    WHERE w.user_id = ? 
    AND t.type = ? 
    AND MONTH(t.date) = ? 
    AND YEAR(t.date) = ?
  `;

  const [rows] = await db.query(query, [userId, type, month, year]);
  
  return rows[0];
};

export const insertTransactionsModels = async (
  categoryId,
  accountId,
  type,
  amount,
  description,
  date
) => {
  const query = `INSERT INTO transactions (category_id, account_id, type, amount, description, date, created_at) 
    VALUES ( ?, ?, ?, ?, ?, ? ,NOW())
    `;
  const [result] = await db.query(query, [categoryId, accountId, type, amount, description, date]);

  return result;
};

export const updateTransactionsModels = async (id, fields) => {
  const updates = Object.keys(fields)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(fields);
  const query = `UPDATE transactions SET ${updates} WHERE transaction_id = ?`;
  const [result] = await db.query(query, [...values, id]);

  return result;
};

export const deleteTransactionsModels = async (id) => {
  const query = `DELETE FROM transactions WHERE transaction_id = ?`;
  const [result] = await db.query(query, [id]);

  return result;
};
