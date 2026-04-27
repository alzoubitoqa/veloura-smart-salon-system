require("dotenv").config();
const app = require("./app");
const db = require("./config/db");
const bcrypt = require("bcryptjs");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await db.query("SELECT 1");
    console.log("Database connected successfully");

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        role VARCHAR(50)
      );
    `);

    console.log("Users table ready ✅");

    // 🔥🔥🔥 التعديل هون (بدل admin واحد → عدة users)
    const password = await bcrypt.hash("123456", 10);

    const users = [
      ["Admin", "admin@veloura.com", password, "admin"],
      ["Reception", "reception@veloura.com", password, "reception"],
      ["Staff", "staff@veloura.com", password, "staff"],
    ];

    for (const user of users) {
      await db.query(
        `
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          password = VALUES(password),
          role = VALUES(role);
        `,
        user
      );
    }

    console.log("All users ready 👑");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
      console.log(`Mobile access: http://192.168.1.109:${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed:");
    console.error(error);
  }
}

startServer();