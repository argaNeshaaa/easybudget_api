import db from "../config/db.js";

// Get all transactions
export const getAllTransactions = (req, res) => {
  db.query("SELECT * FROM transactions", (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(result);
  });
};

// Get transaction by ID
export const getTransactionById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM transactions WHERE transaction_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(result[0]);
  });
};

// Create New Transactions
export const createTransactions = (req, res) => {
  const { wallet_id, category_id, account_id, type, amount, description, date } = req.body;
  db.query("INSERT INTO transactions (wallet_id, category_id, account_id, type, amount, description, date) VALUES (?, ?, ?, ?, ?, ?, ?)", [wallet_id, category_id, account_id, type, amount, description, date], (err, result) => {
    if (err) return res.status(500).json({ message: "Insert error", error: err });
    res.json({ message: "Transactions created", transaction_id: result.insertId });
  });
};

// Update Transactions
export const updateTransactions = (req, res) => {
  const { id } = req.params;
  const { wallet_id, category_id, account_id, type, amount, description, date } = req.body;
  db.query("")
}
// Get all categories
export const getAllCategories = (req, res) => {
  db.query("SELECT * FROM categories", (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(result);
  });
};

// Get category by ID
export const getCategoryById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM categories WHERE category_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(result[0]);
  });
};

// Create new category
export const createCategory = (req, res) => {
  const { user_id, name, type } = req.body;
  db.query("INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)", [user_id, name, type], (err, result) => {
    if (err) return res.status(500).json({ message: "Insert error", error: err });
    res.json({ message: "Category created", category_id: result.insertId });
  });
};

// Update category
export const updateCategory = (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;
  db.query("UPDATE categories SET name = ?, type = ? WHERE category_id = ?", [name, type, id], (err) => {
    if (err) return res.status(500).json({ message: "Update error", error: err });
    res.json({ message: "Category updated" });
  });
};

// Delete category
export const deleteCategory = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM categories WHERE category_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Delete error", error: err });
    res.json({ message: "Category deleted" });
  });
};
