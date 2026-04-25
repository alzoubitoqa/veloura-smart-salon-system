require("dotenv").config();
const app = require("./app");
const db = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 🔹 تأكد الاتصال
    await db.query("SELECT 1");
    console.log("Database connected successfully");

    // 🔥 إنشاء جدول users إذا مش موجود
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