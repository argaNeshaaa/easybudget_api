// google.js
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

        // Cek user di DB
        const [rows] = await db.execute(
          "SELECT * FROM users WHERE email = ?",
          [email]
        );

        let user = rows[0];

        if (!user) {
          // Jika user belum ada, buat baru
          const [result] = await db.execute(
            `INSERT INTO users (name, email, password, account_type)
             VALUES (?, ?, NULL, 'personal')`,
            [name, email]
          );

          user = {
            user_id: result.insertId,
            name,
            email,
          };
        }

        // Kembalikan user (akan masuk ke req.user di controller)
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// serializeUser dan deserializeUser DIHAPUS karena kita pakai JWT (Stateless)

export default passport;