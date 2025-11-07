import db from "../config/db";

export const findAllInvoicesModels = async () => {
    const query = `SELECT * FROM invoices`;
    const [rows] = await db.promise().query(query);

    return rows;
};

export const findInvoicesByIdModels = async (id) => {
    const query = `SELECT * FROM invoices WHERE invoice_id = ?`;
    const [rows] = await db.promise().query(query, [id]);

    return rows[0]
};

export const findInvoicesByBusinessIdModels = async (businessId) => {
    const query = `SELECT * FROM invoices WHERE business_id = ?`;
    const [rows] = await db.promise().query(query, [businessId]);

    return rows;
};

export const insertInvoicesModels = async (businessId, invoiceNumber, clientName, totalAmount, status, issueDate, dueDate) => {
    const query = `
    INSERT INTO invoices (business_id, invoice_number, client_name, total_amount, status, issue_date, due_date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
    const [result] = await db.promise().query(query, [businessId, invoiceNumber, clientName, totalAmount, status, issueDate, dueDate]);

    return result;
};

export const updateInvoicesModels = async (id, fields) => {
  const updates = Object.keys(fields).map(key => `${key} = ?`).join(", ");
  const values = Object.values(fields);
  const query = `UPDATE invoices SET ${updates} WHERE user_id = ?`;
  const [result] = await db.promise().query(query,[...values, id]);
  
  return result; 
};

export const deleteInvoicesModels = async (id) => {
    const query = `DELETE FROM invoices WHERE invoice_id = ?`;
    const [result] = await db.promise().query(query, [id]);

    return result;
};