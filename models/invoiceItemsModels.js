import db from "../config/db.js";

export const findAllInvoiceItemsModels = async () => {
    const query = `SELECT * FROM invoice_items`;
    const [rows] = await db.promise().query(query);

    return rows;
};

export const findInvoiceItemsByIdModels = async (id) => {
    const query = `SELECT * FROM invoice_items WHERE item_id = ?`;
    const [rows] = await db.promise().query(query, [id]);

    return rows[0];
};

export const findInvoiceItemsByInvoiceIdModels = async (invoiceId) => {
    const query = `SELECT * FROM invoice_items WHERE invoice_id = ?`;
    const [rows] = await db.promise().query(query, [invoiceId]);

    return rows;
}

export const insertInvoiceItemsModels = async (invoiceId, description, quantity, unitPrice) => {
    const query = `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price) values (?, ?, ?, ?)`;
    const [result] = await db.promise().query(query, [invoiceId, description, quantity, unitPrice])

    return result;
};

export const updateInvoiceItemsModels = async (id, fields) => {
  const updates = Object.keys(fields).map(key => `${key} = ?`).join(", ");
  const values = Object.values(fields);
  const query = `UPDATE invoice_items SET ${updates} WHERE item_id = ?`;
  const [result] = await db.promise().query(query,[...values, id]);
  
  return result; 
};

export const deleteInvoiceItemsModels = async (id) => {
    const query = `DELETE FROM invoice_items WHERE item_id = ?`;
    const [result] = await db.promise().query(query, [id]);

    return result;
};

