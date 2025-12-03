import db from "../config/db.js";

// 1. Monthly Summary (Income vs Expense per Bulan)
export const getMonthlyReportModels = async (userId, year) => {
  // Query ini menghitung total income dan expense per bulan untuk user tertentu di tahun tertentu
  const query = `
    SELECT 
      MONTH(t.date) as month,
      COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
      COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expense
    FROM transactions t
    JOIN accounts a ON t.account_id = a.account_id
    JOIN wallets w ON a.wallet_id = w.wallet_id
    WHERE w.user_id = ? AND YEAR(t.date) = ?
    GROUP BY MONTH(t.date)
    ORDER BY month ASC
  `;
  const [rows] = await db.query(query, [userId, year]);
  return rows;
};

// 2. Category Breakdown (Pie Chart - Total per Kategori)
export const getCategoryReportModels = async (userId, month, year, type) => {
  // Query ini mengambil total transaksi per kategori, difilter berdasarkan bulan, tahun, dan tipe (income/expense)
  const query = `
    SELECT 
      c.name as category_name,
      c.icon as category_icon,
      COALESCE(SUM(t.amount), 0) as total_amount
    FROM transactions t
    JOIN categories c ON t.category_id = c.category_id
    JOIN accounts a ON t.account_id = a.account_id
    JOIN wallets w ON a.wallet_id = w.wallet_id
    WHERE w.user_id = ? 
      AND MONTH(t.date) = ? 
      AND YEAR(t.date) = ?
      AND t.type = ?
    GROUP BY c.category_id, c.name, c.icon
    ORDER BY total_amount DESC
  `;
  const [rows] = await db.query(query, [userId, month, year, type]);
  return rows;
};

// 3. Executive Summary (Net Worth, Cash Flow, Avg Daily)
export const getExecutiveSummaryModels = async (userId, month, year) => {
  // Cash Flow Bulan Ini: Menghitung total income dan expense bulan ini
  const cfQuery = `
    SELECT 
      COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as income,
      COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as expense
    FROM transactions t
    JOIN accounts a ON t.account_id = a.account_id
    JOIN wallets w ON a.wallet_id = w.wallet_id
    WHERE w.user_id = ? AND MONTH(t.date) = ? AND YEAR(t.date) = ?
  `;
  
  // Net Worth (Total Saldo Semua Wallet): Menghitung total saldo dari semua wallet milik user
  const nwQuery = `
    SELECT COALESCE(SUM(balance), 0) as net_worth FROM wallets WHERE user_id = ?
  `;

  // Menjalankan kedua query secara parallel untuk efisiensi
  const [cfRows] = await db.query(cfQuery, [userId, month, year]);
  const [nwRows] = await db.query(nwQuery, [userId]);

  return {
    cash_flow: cfRows[0],
    net_worth: nwRows[0].net_worth || 0
  };
};