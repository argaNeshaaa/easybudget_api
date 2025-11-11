import db from "../config/db.js";
import ApiError from "../utils/ApiError.js";

export const findUserIdForAuthorizeModels = async (
  roles,
  recordId,
  tableName
) => {
  let query;

  if ((roles === "self" && tableName === "users") || tableName === "users") {
    query = `SELECT user_id FROM users WHERE user_id = ? `;
  } else if (
    (roles === "self" && tableName === "wallets") ||
    tableName === "wallets"
  ) {

    query = `SELECT user_id FROM wallets WHERE wallet_id = ? `;
  } else if (
    (roles === "self" && tableName === "accounts") ||
    tableName === "accounts"
  ) {

    query = `SELECT w.user_id FROM wallets w JOIN accounts a ON  w.wallet_id  = a.wallet_id WHERE a.account_id = ? `;
  } else if (
    (roles === "self" && tableName === "categories") ||
    tableName === "categories"
  ) {

    query = `SELECT user_id FROM categories WHERE category_id = ? `;
  } else if (
    (roles === "self" && tableName === "transactions") ||
    tableName === "transactions"
  ) {

    query = `SELECT w.user_id FROM wallets w JOIN accounts a ON a.wallet_id = w.wallet_id JOIN transactions t ON t.account_id = a.account_id WHERE t.transaction_id = ? `;
  } else if (
    (roles === "self" && tableName === "budgets") ||
    tableName === "budgets"
  ) {

    query = `SELECT user_id FROM budgets WHERE budget_id = ? `;
  } else if (
    (roles === "self" && tableName === "goals") ||
    tableName === "goals"
  ) {

    query = `SELECT user_id FROM goals WHERE goal_id =? `;
  } else if (
    (roles === "self" && tableName === "businesses") ||
    tableName === "businesses"
  ) {
    
    query = `SELECT user_id FROM businesses WHERE business_id = ? `;
  } else if (
    (roles === "self" && tableName === "invoices") ||
    tableName === "invoices"
  ) {

    query = `SELECT b.user_id FROM businesses b JOIN invoices i ON b.business_id = i.business_id WHERE i.invoice_id = ? `;
  } else if (
    (roles === "self" && tableName === "invoice_items") ||
    tableName === "invoice_items"
  ) {

    query = `SELECT b.user_id FROM businesses b JOIN invoices i ON b.business_id = i.business_id JOIN invoice_items ii ON ii.invoice_id = i.invoice_id WHERE ii.item_id = ? `;
  } else {
    
    throw ApiError.database(`Table name "${tableName}" is not supported.`);
  }

  const [result] = await db.promise().query(query, [recordId]);

  return result[0];
};
