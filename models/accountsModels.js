import db from "../config/db";
export const findAllAccountsModels = (callback) => {
    const query = `SELECT * FROM accounts`;
    db.query(query, callback);
}