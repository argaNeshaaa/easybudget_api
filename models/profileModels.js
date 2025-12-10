import db from "../config/db.js";

export const findProfileByUserModels = async (id) => {
    const query = `SELECT p.*, pg.nama_penghasilan FROM profile p 
    JOIN penghasilan pg ON p.id_penghasilan = pg.id_penghasilan
    WHERE p.user_id = ?;`;
    const [rows] = await db.query(query, [id]);

    return rows[0];
};

export const insertProfileModels = async (userId, job, idFlow, moneyMonth) => {
    const query = `INSERT INTO profile (user_id, pekerjaan, id_penghasilan, pendapatan_bulanan, created_at) VALUES (?, ?, ?, ?, NOW())`;
    const [result] = await db.query(query, [userId, job, idFlow, moneyMonth]);

    return result;

}

export const updateProfileModels = async (id, fields) => {
  const updates = Object.keys(fields)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(fields);
  const query = `UPDATE profile SET ${updates} WHERE user_id = ?`;
  const [result] = await db.query(query, [...values, id]);

  return result;
};


export const deleteProfileModels = async (id) => {
    const query = `DELETE FROM profile WHERE user_id = ?`;
    const [result] = await db.query(query, [id]);

    return result;
}