const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const db = require("../config/db.js");

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

        // cek user berdasarkan email
        const [rows] = await db.execute(
          "SELECT * FROM users WHERE email = ?",
          [email]
        );

        let user = rows[0];

        // jika user belum ada → daftar otomatis
        if (!user) {
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

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// serialize (gunakan user_id!)
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

// deserialize
passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [id]
    );
    done(null, rows[0]);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
