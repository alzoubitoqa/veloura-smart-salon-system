require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./src/config/db");

async function seedUsers() {
  try {
    const users = [
      {
        name: "Admin User",
        email: "admin@pearls.com",
        password: "123456",
        role: "admin",
      },
      {
        name: "Reception User",
        email: "reception@pearls.com",
        password: "123456",
        role: "reception",
      },
      {
        name: "Staff User",
        email: "staff@pearls.com",
        password: "123456",
        role: "staff",
      },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [user.name, user.email, hashedPassword, user.role]
      );
    }

    console.log("Users seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
}

seedUsers();

