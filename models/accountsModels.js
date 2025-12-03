import db from "../config/db.js";

export const findAllAccountsModels = async () => {
  const query = `SELECT * FROM accounts`;
  const [rows] = await db.query(query);

  return rows;
};

export const findAccountsByIdModels = async (id) => {
  const query = `SELECT * FROM accounts WHERE account_id = ?`;
  const [rows] = await db.query(query, [id]);

  return rows[0];
};

export const findAccountsByWalletIdModels = async (id) => {
  const query = `SELECT * FROM accounts WHERE wallet_id = ?`;
  const [rows] = await db.query(query, [id]);

  return rows;
};

export const getAccountsWithStatsModels = async (userId) => {
  const query = `
    SELECT 
      a.account_id,
      a.account_name,
      a.account_number,
      a.account_type,
      a.balance,
      w.category as wallet_category,
      -- Hitung Total Income per Account
      COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
      -- Hitung Total Expense per Account
      COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expense
    FROM accounts a
    JOIN wallets w ON a.wallet_id = w.wallet_id
    LEFT JOIN transactions t ON a.account_id = t.account_id
    WHERE w.user_id = ?
    GROUP BY a.account_id
    ORDER BY a.created_at DESC
  `;

  const [rows] = await db.query(query, [userId]);
  return rows;
};

export const insertAccountsModels = async (
  walletId,
  accountName,
  accountNumber,
  balance,
  accountType
) => {
  const query = `INSERT INTO accounts (wallet_id, account_name, account_number, balance, account_type, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;
  const [result] = await db.query(query, [walletId, accountName, accountNumber, balance, accountType]);

  return result;
};

export const updateAccountsModels = async (id, fields) => {
  const updates = Object.keys(fields)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(fields);
  const query = `UPDATE accounts SET ${updates}, updated_at = NOW() WHERE account_id = ?`;
  const [result] = await db.query(query, [...values, id]);

  return result;
};

export const deleteAccountsModels = async (id) => {
  const query = `DELETE FROM accounts WHERE account_id = ?`;
  const [result] = await db.query(query, [id]);

  return result;
};
