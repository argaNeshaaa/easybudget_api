import db from "../config/db.js";

// Get all wallets
export const getAllWallets = (req, res) => {
  db.query("SELECT * FROM wallets", (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(result);
  });
};

// Get wallet by ID
export const getWalletById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM wallets WHERE wallet_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(result[0]);
  });
};
