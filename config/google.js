import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import db from "../config/db.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;

        // 1. Cek apakah user sudah ada
        // Kita JOIN dengan tabel roles untuk mendapatkan NAME dari role tersebut (user/admin)
        // karena middleware butuh string namanya, bukan angka 1 atau 2.
        const query = `
          SELECT users.*, roles.name AS role_name 
          FROM users 
          LEFT JOIN roles ON users.role_id = roles.id 
          WHERE users.email = ?
        `;
        
        const [rows] = await db.query(query, [email]);
        let user = rows[0];

        if (!user) {
          // ============================================================
          // 2. KONDISI USER BARU (REGISTER)
          // ============================================================
          // Masukkan role_id = 1 (Sesuai aturan: 1 adalah default User Biasa)
          const insertQuery = `
            INSERT INTO users (name, email, password, account_type, role_id, created_at)
            VALUES (?, ?, NULL, 'personal', 1, NOW())
          `;

          const [result] = await db.query(insertQuery, [name, email]);

          // Setup object user untuk dikirim ke token
          user = {
            user_id: result.insertId,
            name: name,
            email: email,
            role: 'user', // Kita set manual stringnya karena kita tahu ID 1 = 'user'
            account_type: 'personal'
          };
        } else {
          // ============================================================
          // 3. KONDISI USER LAMA (LOGIN)
          // ============================================================
          // Pastikan properti .role terisi dengan nama role dari database
          // Jika role_name null (misal tabel roles error), fallback ke 'user'
          user.role = user.role_name || 'user';
        }

        // Kembalikan user yang lengkap dengan properti .role
        return done(null, user);
        
      } catch (err) {
        console.error("Google Auth Error:", err);
        return done(err, null);
      }
    }
  )
);

export default passport;