import {
  getMonthlyReportModels,
  getCategoryReportModels,
  getExecutiveSummaryModels
} from "../models/reportsModels.js";
import ApiError from "../utils/ApiError.js";

let context = "Report";

export const getMonthlyReportServices = async (userId, queryParams) => {
  try {
    const year = queryParams.year || new Date().getFullYear();
    const result = await getMonthlyReportModels(userId, year);
    
    // Optional: Isi bulan yang kosong dengan 0 agar grafik tetap cantik 1-12
    const completeData = [];
    for (let m = 1; m <= 12; m++) {
        const found = result.find(r => r.month === m);
        completeData.push(found || { month: m, total_income: 0, total_expense: 0 });
    }
    return completeData;
  } catch (error) {
    throw ApiError.database(context);
  }
};

export const getCategoryReportServices = async (userId, queryParams) => {
  try {
    const month = queryParams.month || new Date().getMonth() + 1;
    const year = queryParams.year || new Date().getFullYear();
    const type = queryParams.type || 'expense'; // Default expense pie chart

    return await getCategoryReportModels(userId, month, year, type);
  } catch (error) {
    throw ApiError.database(context);
  }
};

export const getExecutiveSummaryServices = async (userId, queryParams) => {
  try {
    const month = queryParams.month || new Date().getMonth() + 1;
    const year = queryParams.year || new Date().getFullYear();
    
    const data = await getExecutiveSummaryModels(userId, month, year);
    
    // Hitung rata-rata harian sederhana
    const daysInMonth = new Date(year, month, 0).getDate();
    // Jika bulan ini, bagi dengan tanggal hari ini agar rata-rata real
    const currentDay = new Date().getDate();
    const divider = (month == new Date().getMonth() + 1) ? currentDay : daysInMonth;
    
    data.avg_daily_expense = data.cash_flow.expense / (divider || 1);

    return data;
  } catch (error) {
    throw ApiError.database(context);
  }
};