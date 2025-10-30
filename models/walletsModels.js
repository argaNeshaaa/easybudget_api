import db from "../config/db.js";

export const findAllWalletsModels = (callback) => {
const query = `SELECT * FROM wallets`;
db.query(query, callback);
}

export const findWalletsByIdModels = (id, callback) => {
    const query = `SELECT * FROM wallets WHERE wallet_id = ?`;
    db.query(query, [id], callback);
}

export const findWalletsByUserIdModels = (id, callback) => {
    const query = `SELECT * FROM wallets WHERE user_id = ?`;
    db.query(query, [id], callback);
}

export const checkUserByWalletModels = (wallet_id, callback) => {
  const query = `SELECT user_id FROM wallets WHERE wallet_id = ?`;
  db.query(query, [wallet_id], callback);
};

export const insertWalletsModels = (idUser, name, type, balance, currency, callback) => {
    const query = `INSERT INTO wallets (user_id, name, type, balance, currency, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;
  db.query(query,[idUser, name, type, balance, currency], callback);
}

export const updateWalletsModels = (id, fields, callback) => {
    const updates = Object.keys(fields).map(key => `${key} = ?`).join(", ");
    const values = Object.values(fields);
    const query = `UPDATE wallets SET ${updates} WHERE wallet_id = ?`;
    db.query(query, [...values, id], callback);
}

export const deleteWalletsModels = (id, callback) => {
    const query = `DELETE FROM wallets WHERE wallet_id = ?`;
    db.query(query, [id] , callback);
}