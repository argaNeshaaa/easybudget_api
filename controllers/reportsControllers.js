import {
  getMonthlyReportServices,
  getCategoryReportServices,
  getExecutiveSummaryServices
} from "../services/reportsServices.js";
import { successResponse } from "../utils/responseHandler.js";

export const getMonthlyReportController = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const result = await getMonthlyReportServices(userId, req.query);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getCategoryReportController = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const result = await getCategoryReportServices(userId, req.query);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getExecutiveSummaryController = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const result = await getExecutiveSummaryServices(userId, req.query);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const exportReportController = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { month, year } = req.query; // Ambil periode dari query params

    // 1. Ambil semua data report dari Service (Parallel)
    const [summary, monthlyData, categoryData] = await Promise.all([
      getExecutiveSummaryServices(userId, { month, year }),
      getMonthlyReportServices(userId, { year }),
      getCategoryReportServices(userId, { month, year, type: 'expense' }) // Fokus ke pengeluaran dulu
    ]);

    // 2. Setup Workbook & Worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Financial Report');

    // --- STYLE UTAMA ---
    worksheet.columns = [
      { header: 'Deskripsi', key: 'desc', width: 30 },
      { header: 'Nilai', key: 'value', width: 20 },
      { header: '', key: 'empty', width: 5 }, // Spasi
      { header: 'Bulan', key: 'month', width: 15 },
      { header: 'Pemasukan', key: 'income', width: 20 },
      { header: 'Pengeluaran', key: 'expense', width: 20 },
    ];

    // --- BAGIAN 1: RINGKASAN EKSEKUTIF ---
    worksheet.addRow(['LAPORAN KEUANGAN', `Periode: ${month}/${year}`]).font = { bold: true, size: 14 };
    worksheet.addRow([]); // Spasi kosong

    worksheet.addRow(['Total Kekayaan Bersih', summary.net_worth]);
    worksheet.addRow(['Total Pemasukan (Bulan Ini)', summary.cash_flow.income]);
    worksheet.addRow(['Total Pengeluaran (Bulan Ini)', summary.cash_flow.expense]);
    worksheet.addRow(['Rata-rata Pengeluaran Harian', summary.avg_daily_expense]);
    
    worksheet.addRow([]); // Spasi
    worksheet.addRow([]); // Spasi

    // --- BAGIAN 2: DATA BULANAN (Tabel di kanan) ---
    // Kita tulis header manual di baris tertentu
    const startRowMonth = 8;
    worksheet.getCell(`D${startRowMonth}`).value = 'Tren Bulanan (Tahun Ini)';
    worksheet.getCell(`D${startRowMonth}`).font = { bold: true };
    
    worksheet.getCell(`D${startRowMonth+1}`).value = 'Bulan';
    worksheet.getCell(`E${startRowMonth+1}`).value = 'Pemasukan';
    worksheet.getCell(`F${startRowMonth+1}`).value = 'Pengeluaran';

    // Loop data bulanan
    monthlyData.forEach((data, index) => {
        const row = startRowMonth + 2 + index;
        const monthName = new Date(0, data.month - 1).toLocaleString('id-ID', { month: 'long' });
        
        worksheet.getCell(`D${row}`).value = monthName;
        worksheet.getCell(`E${row}`).value = Number(data.total_income);
        worksheet.getCell(`F${row}`).value = Number(data.total_expense);
    });

    // --- BAGIAN 3: DETAIL KATEGORI (Tabel di kiri bawah) ---
    const startRowCat = 8;
    worksheet.getCell(`A${startRowCat}`).value = 'Rincian Pengeluaran per Kategori';
    worksheet.getCell(`A${startRowCat}`).font = { bold: true };

    worksheet.getCell(`A${startRowCat+1}`).value = 'Kategori';
    worksheet.getCell(`B${startRowCat+1}`).value = 'Total (Rp)';

    categoryData.forEach((cat, index) => {
        const row = startRowCat + 2 + index;
        worksheet.getCell(`A${row}`).value = cat.category_name;
        worksheet.getCell(`B${row}`).value = Number(cat.total_amount);
    });

    // 3. Set Response Header agar Browser download file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Financial_Report_${year}_${month}.xlsx`
    );

    // 4. Tulis Workbook ke Response
    await workbook.xlsx.write(res);
    res.status(200).end();

  } catch (error) {
    next(error);
  }
};