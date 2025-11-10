import db from "../config/db.js";

export const findAllTransactionsModels = async () => {
  const query = `SELECT * FROM transactions`;
  const [rows] = await db.promise().query(query);

  return rows;
};

export const findTransactionsByIdModels = async (id) => {
  const query = `SELECT * FROM transactions WHERE transaction_id = ?`;
  const [rows] = await db.promise().query(query, [id]);

  return rows[0];
};

export const findTransactionsByAccountIdModels = async (accountId) => {
  const query = `SELECT * FROM transactions WHERE account_id = ?`;
  const [rows] = await db.promise().query(query, [accountId]);

  return rows;
};

export const findTransactionsByUserIdModels = async (userId) => {
  const query = `SELECT t.* FROM transactions t
  JOIN accounts a ON t.account_id = a.account_id
  JOIN wallets w ON a.wallet_id = w.wallet_id
  WHERE w.user_id = ?`;
  const [rows] = await db.promise().query(query, [userId]);

  return rows;
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
  const [result] = await db
    .promise()
    .query(query, [categoryId, accountId, type, amount, description, date]);

  return result;
};

export const updateTransactionsModels = async (id, fields) => {
  const updates = Object.keys(fields)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(fields);
  const query = `UPDATE transactions SET ${updates} WHERE transaction_id = ?`;
  const [result] = await db.promise().query(query, [...values, id]);

  return result;
};

export const deleteTransactionsModels = async (id) => {
  const query = `DELETE FROM transactions WHERE transaction_id = ?`;
  const [result] = await db.promise().query(query, [id]);

  return result;
};
