import db from "../config/db.js";
import ApiError from "../utils/ApiError.js";

export const findUserIdForAuthorizeModels = async (recordId, tableName) => {
  let query;
  switch (tableName) {
    case "wallets":
      query = `SELECT user_id FROM wallets WHERE wallet_id = ? `;
      break;

    case "accounts":
      query = `SELECT w.user_id FROM wallets w JOIN accounts a ON  w.wallet_id  = a.wallet_id WHERE a.account_id = ? `;
      break;

    case "categories":
      query = `SELECT user_id FROM categories WHERE category_id = ? `;
      break;

    case "transactions":
      query = `SELECT w.user_id FROM wallets w JOIN accounts a ON a.wallet_id = w.wallet_id JOIN transactions t ON t.account_id = a.account_id WHERE t.transaction_id = ? `;
      break;

    case "budgets":
      query = `SELECT user_id FROM budgets WHERE budget_id = ? `;
      break;

    case "goals":
      query = `SELECT user_id FROM goals WHERE goal_id =? `;
      break;

    case "businesses":
      query = `SELECT user_id FROM businesses WHERE business_id = ? `;
      break;

    case "invoices":
      query = `SELECT b.user_id FROM businesses b JOIN invoices i ON b.business_id = i.business_id WHERE i.invoice_id = ? `;
      break;

    case "invoice_items":
      query = `SELECT b.user_id FROM businesses b JOIN invoices i ON b.business_id = i.business_id JOIN invoice_items ii ON ii.invoice_id = i.invoice_id WHERE ii.item_id = ? `;
      break;

    default:
      throw ApiError.database(`Table name "${tableName}" is not supported.`);
    break;
  }

  const [result] = await db.promise().query(query, [recordId]);

  return result[0];
};
