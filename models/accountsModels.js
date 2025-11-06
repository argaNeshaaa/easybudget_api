import db from "../config/db.js";

export const findAllAccountsModels = async () => {
    const query = `SELECT * FROM accounts`;
    const [rows] = await db.promise().query(query);

    return rows;
};

export const findAccountsByIdModels = async (id) => {
    const query = `SELECT * FROM accounts WHERE account_id = ?`;
    const [rows] = await db.promise().query(query, [id]);

    return rows[0];
};

export const findAccountsByWalletIdModels = async (id) => {
    const query = `SELECT * FROM accounts WHERE wallet_id = ?`;
    const [rows] = await db.promise().query(query, [id]);

    return rows;
};

export const insertAccountsModels = async (walletId, accountName, accountNumber, balance, accountType) => {
    const query = `INSERT INTO accounts (wallet_id, account_name, account_number, balance, account_type, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const [result] = await db.promise().query(query, [walletId, accountName, accountNumber, balance, accountType]);

    return result;
};

export const updateAccountsModels = async (id, fields) => {
  const updates = Object.keys(fields).map(key => `${key} = ?`).join(", ");
  const values = Object.values(fields);
  const query = `UPDATE accounts SET ${updates}, updated_at = NOW() WHERE account_id = ?`;
  const [result] = await db.promise().query(query,[...values, id]);
  
  return result; 
};

export const deleteAccountsModels = async (id) => {
    const query = `DELETE FROM accounts WHERE account_id = ?`;
    const [result] = await db.promise().query(query,[id]);

    return result;
};