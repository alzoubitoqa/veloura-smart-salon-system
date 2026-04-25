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
        '$2b$10$k9xeHWSjjBVMdzyxwhro1.Sx6B.LZ6/Caa2KE/8QNKaz11/ajT442',
        'admin'
      )
      ON CONFLICT (email) DO NOTHING;
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