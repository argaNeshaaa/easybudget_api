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
    
    // Normalisasi Data: Pastikan ada data untuk bulan 1 s/d 12
    // Jika data bulan tertentu tidak ada di database, isi dengan 0
    const completeData = [];
    for (let m = 1; m <= 12; m++) {
        const found = result.find(r => r.month === m);
        const income = found ? Number(found.total_income) : 0;
        const expense = found ? Number(found.total_expense) : 0;
        
        completeData.push({ 
            month: m, 
            total_income: income, 
            total_expense: expense 
        });
    }
    return completeData;
  } catch (error) {
    console.error(error);
    throw ApiError.database(context);
  }
};

export const getCategoryReportServices = async (userId, queryParams) => {
  try {
    const month = queryParams.month || new Date().getMonth() + 1;
    const year = queryParams.year || new Date().getFullYear();
    const type = queryParams.type || 'expense'; // Default pie chart expense

    return await getCategoryReportModels(userId, month, year, type);
  } catch (error) {
    throw ApiError.database(context);
  }
};

export const getExecutiveSummaryServices = async (userId, queryParams) => {
  try {
    const month = Number(queryParams.month) || new Date().getMonth() + 1;
    const year = Number(queryParams.year) || new Date().getFullYear();
    
    const data = await getExecutiveSummaryModels(userId, month, year);
    
    // Hitung rata-rata harian
    const daysInMonth = new Date(year, month, 0).getDate();
    const currentDay = new Date().getDate();
    // Jika bulan ini, bagi dengan tanggal hari ini agar rata-rata real-time
    const isCurrentMonth = (month === new Date().getMonth() + 1) && (year === new Date().getFullYear());
    
    const divider = isCurrentMonth ? currentDay : daysInMonth;
    const safeDivider = divider > 0 ? divider : 1;
    
    data.avg_daily_expense = Number(data.cash_flow.expense) / safeDivider;

    return data;
  } catch (error) {
    throw ApiError.database(context);
  }
};