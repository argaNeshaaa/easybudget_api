import model from "../config/gemini.js";
import { getExecutiveSummaryServices, getCategoryReportServices } from "./reportsServices.js";
import { findProfileByUserServices } from "./profileServices.js"; // <--- 1. IMPORT INI
import ApiError from "../utils/ApiError.js";

export const chatWithAIService = async (userId, userMessage) => {
  try {
    // 1. Ambil Data Konteks Keuangan User & Profil
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Mengambil ringkasan, breakdown kategori, DAN PROFIL secara paralel
    const [summary, categories, profile] = await Promise.all([
      getExecutiveSummaryServices(userId, { month, year }),
      getCategoryReportServices(userId, { month, year, type: 'expense' }),
      findProfileByUserServices(userId) // <--- 2. AMBIL DATA PROFIL
    ]);

    // 3. Format Data Profil (Handle jika profil belum diisi)
    const profileContext = profile 
      ? `
      - Pekerjaan: ${profile.pekerjaan}
      - Jenis Penghasilan: ${profile.nama_penghasilan || 'Tidak spesifik'}
      - Pendapatan Tetap Bulanan: Rp ${profile.pendapatan_bulanan?.toLocaleString('id-ID') || 0}`
      : `
      - Profil Pekerjaan: Belum diisi oleh pengguna (Asumsikan umum)`;

    // 4. Format Data menjadi String yang mudah dibaca AI
    const contextData = `
      [PROFIL PENGGUNA]
      ${profileContext}

      [DATA KEUANGAN BULAN INI (${month}/${year})]
      - Total Kekayaan Bersih (Net Worth): Rp ${summary.net_worth}
      - Pemasukan Realisasi Bulan Ini: Rp ${summary.cash_flow.income}
      - Pengeluaran Bulan Ini: Rp ${summary.cash_flow.expense}
      - Rata-rata Pengeluaran Harian: Rp ${summary.avg_daily_expense.toFixed(0)}
      - Breakdown Pengeluaran per Kategori:
        ${categories.map(c => `- ${c.category_name}: Rp ${c.total_amount}`).join('\n        ')}
    `;

    // 5. Buat Prompt (Instruksi) untuk AI
    const prompt = `
      Kamu adalah asisten keuangan pribadi yang cerdas, ramah, dan bijaksana bernama "Natan".
      Tugasmu adalah membantu pengguna mengelola keuangan mereka berdasarkan data profil dan transaksi di bawah ini.
      
      ${contextData}

      ATURAN PENTING:
      1. Gunakan data profil (Pekerjaan/Gaji) untuk memberikan saran yang relevan. Contoh: Jika "Freelance", ingatkan tentang dana darurat yang lebih besar. Jika "Bulanan", ingatkan alokasi gaji.
      2. Bandingkan "Pendapatan Tetap" di profil dengan "Pemasukan Realisasi" bulan ini jika ada anomali.
      3. Jika user bertanya tentang data yang tidak ada di atas, berikan jawaban umum atau saran keuangan standar.
      4. Gunakan format Rupiah (Rp) yang rapi.
      5. Berikan saran yang praktis dan memotivasi jika keuangan user terlihat boros (pengeluaran > pemasukan).
      6. Jawablah dengan ringkas, padat, dan jelas.

      PERTANYAAN USER: "${userMessage}"
    `;

    // 6. Kirim ke Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;

  } catch (error) {
    console.error("AI Service Error:", error);
    // Pastikan error message tetap ramah
    throw new Error("Maaf, server AI sedang sibuk atau terjadi kesalahan data. Detail: " + error.message);
  }
};