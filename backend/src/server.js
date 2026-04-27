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

    await db.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        service VARCHAR(255),
        lastVisit DATE,
        notes TEXT,
        visits INT DEFAULT 1,
        loyaltyLevel VARCHAR(50) DEFAULT 'Regular',
        preferredService VARCHAR(255),
        lastOffer VARCHAR(255)
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS staff (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialty VARCHAR(255),
        speed VARCHAR(100),
        status VARCHAR(50) DEFAULT 'available',
        performance VARCHAR(100)
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clientName VARCHAR(255) NOT NULL,
        service VARCHAR(255),
        staff VARCHAR(255),
        date DATE,
        time TIME,
        status VARCHAR(50) DEFAULT 'pending',
        estimatedDuration VARCHAR(100),
        endTime TIME
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255),
        quantity INT DEFAULT 0,
        minLevel INT DEFAULT 0,
        unit VARCHAR(50)
      );
    `);

    console.log("All tables ready ✅");

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
    });
  } catch (error) {
    console.error("Database connection failed:");
    console.error(error);
  }
}

startServer();