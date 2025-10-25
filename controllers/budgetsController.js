import db from "../config/db.js";

// Get all budgets
export const getAllBudgets = (req, res) => {
  db.query("SELECT * FROM budgets", (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(result);
  });
};

// Get budget by ID
export const getBudgetById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM budgets WHERE budget_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(result[0]);
  });
};
