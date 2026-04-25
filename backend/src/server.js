require("dotenv").config();
const app = require("./app");
const db = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 🔹 تأكد الاتصال
    await db.query("SELECT 1");
    console.log("Database connected successfully");

    // 🔥 إنشاء جدول users
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT
      );
    `);

    console.log("Users table ready ✅");

    // 🔥 إضافة admin (إذا مش موجود)
    await db.query(`
      INSERT INTO users (name, email, password, role)
      VALUES (
        'Admin',
        'admin@veloura.com',
        '$2b$10$bS93sPFATSzPRIjzCuIOUsOZa7Tnk1JeFJP6btSZjPh0clSPk1HS',
        'admin'
      )
      ON CONFLICT (email) ;
      DO UPDATE SET password = EXCLUDED.password;
    `);

    console.log("Admin ready 👑");

    // 🔹 تشغيل السيرفر
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed:");
    console.error(error);
  }
}

startServer();