import model from "../config/gemini.js";
import { getExecutiveSummaryServices, getCategoryReportServices } from "./reportsServices.js";
import ApiError from "../utils/ApiError.js";

export const chatWithAIService = async (userId, userMessage) => {
  try {
    // 1. Ambil Data Konteks Keuangan User (Ringkasan Bulan Ini)
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Ambil ringkasan & breakdown kategori
    const [summary, categories] = await Promise.all([
      getExecutiveSummaryServices(userId, { month, year }),
      getCategoryReportServices(userId, { month, year, type: 'expense' })
    ]);

    // 2. Format Data menjadi String yang mudah dibaca AI
    const contextData = `
      [DATA KEUANGAN PENGGUNA BULAN INI (${month}/${year})]
      - Total Kekayaan Bersih: Rp ${summary.net_worth}
      - Pemasukan Bulan Ini: Rp ${summary.cash_flow.income}
      - Pengeluaran Bulan Ini: Rp ${summary.cash_flow.expense}
      - Rata-rata Pengeluaran Harian: Rp ${summary.avg_daily_expense.toFixed(0)}
      - Breakdown Pengeluaran per Kategori:
        ${categories.map(c => `- ${c.category_name}: Rp ${c.total_amount}`).join('\n        ')}
    `;

    // 3. Buat Prompt (Instruksi) untuk AI
    const prompt = `
      Kamu adalah asisten keuangan pribadi yang cerdas, ramah, dan bijaksana bernama "EasyBudget AI".
      Tugasmu adalah membantu pengguna mengelola keuangan mereka berdasarkan data yang diberikan di bawah ini.
      
      ${contextData}

      ATURAN PENTING:
      1. Gunakan data di atas untuk menjawab pertanyaan spesifik user.
      2. Jika user bertanya tentang data yang tidak ada di atas, berikan jawaban umum atau saran keuangan.
      3. Gunakan format Rupiah (Rp) yang rapi.
      4. Berikan saran yang praktis dan memotivasi jika keuangan user terlihat boros (pengeluaran > pemasukan).
      5. Jawablah dengan ringkas, padat, dan jelas.

      PERTANYAAN USER: "${userMessage}"
    `;

    // 4. Kirim ke Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;

  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("Maaf, server AI sedang sibuk. Detail: " + error.message);
  }
};