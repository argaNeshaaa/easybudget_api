import db from "../config/db.js";

// 1. Monthly Summary (Income vs Expense per Bulan)
export const getMonthlyReportModels = async (userId, year) => {
  const query = `
    SELECT 
      MONTH(date) as month,
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
    FROM transactions
    WHERE user_id = ? AND YEAR(date) = ?
    GROUP BY MONTH(date)
    ORDER BY month ASC
  `;
  const [rows] = await db.query(query, [userId, year]);
  return rows;
};

// 2. Category Breakdown (Pie Chart)
export const getCategoryReportModels = async (userId, month, year, type) => {
  const query = `
    SELECT 
      c.name as category_name,
      c.icon as category_icon,
      SUM(t.amount) as total_amount
    FROM transactions t
    JOIN categories c ON t.category_id = c.category_id
    WHERE t.user_id = ? 
      AND MONTH(t.date) = ? 
      AND YEAR(t.date) = ?
      AND t.type = ?
    GROUP BY c.category_id
    ORDER BY total_amount DESC
  `;
  const [rows] = await db.query(query, [userId, month, year, type]);
  return rows;
};

// 3. Executive Summary (Net Worth & Cash Flow)
export const getExecutiveSummaryModels = async (userId, month, year) => {
  // Cash Flow Bulan Ini
  const cfQuery = `
    SELECT 
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
    FROM transactions
    WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?
  `;
  
  // Net Worth (Total Saldo Semua Wallet)
  const nwQuery = `
    SELECT SUM(balance) as net_worth FROM wallets WHERE user_id = ?
  `;

  const [cfRows] = await db.query(cfQuery, [userId, month, year]);
  const [nwRows] = await db.query(nwQuery, [userId]);

  return {
    cash_flow: cfRows[0],
    net_worth: nwRows[0].net_worth || 0
  };
};