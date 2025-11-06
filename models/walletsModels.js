import db from "../config/db.js";

export const findAllWalletsModels = async () => {
const query = `SELECT * FROM wallets`;
const [rows] = await db.promise().query(query);

return rows;
};

export const findWalletsByIdModels = async (id) => {
    const query = `SELECT * FROM wallets WHERE wallet_id = ?`;
    const [rows] = await db.promise().query(query, [id]);

    return rows[0];
};

export const findWalletsByUserIdModels = async (id) => {
    const query = `SELECT * FROM wallets WHERE user_id = ?`;
    const [rows] = await db.promise().query(query, [id]);

    return rows;
}

export const insertWalletsModels = async (idUser, name, type, balance, currency) => {
    const query = `INSERT INTO wallets (user_id, name, type, balance, currency, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await db.promise().query(query, [idUser, name, type, balance, currency])
    
    return result;
};

export const updateWalletsModels = async (id, fields) => {
    const updates = Object.keys(fields).map(key => `${key} = ?`).join(", ");
    const values = Object.values(fields);
    const query = `UPDATE wallets SET ${updates}, updated_at = NOW() WHERE wallet_id = ?`;
    const [result] = await db.promise().query(query,[...values, id]);

    return result;
};

export const deleteWalletsModels = async (id) => {
    const query = `DELETE FROM wallets WHERE wallet_id = ?`;
    const [result] = await db.promise().query(query,[id]);

    return result;
};