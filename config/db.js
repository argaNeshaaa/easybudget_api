// config/db.js
import mysql from "mysql2/promise"; // <--- PERUBAHAN UTAMA: Tambah '/promise'
import dotenv from "dotenv";

dotenv.config();

// Gunakan createPool, bukan createConnection
// Pool lebih stabil untuk server web (menangani putus koneksi otomatis)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test koneksi (Optional, hanya agar Anda tahu server connect)
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Connected to MySQL database via Pool ✅");
    connection.release(); // Kembalikan koneksi ke pool
  } catch (err) {
    console.error("Database connection failed:", err);
  }
})();

export default db;