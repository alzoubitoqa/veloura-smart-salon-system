const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // تنظيف الإيميل
    email = email.trim().toLowerCase();

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];

    // حل مشكلة blob
    const storedPassword = Buffer.isBuffer(user.password)
      ? user.password.toString("utf8")
      : String(user.password);

    // مقارنة الباسورد
    const isMatch = await bcrypt.compare(password, storedPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // توليد التوكن
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "admin",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

// ================= REGISTER =================
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [cleanEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, cleanEmail, hashedPassword, role || "admin"]
    );

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ================= GET USERS =================
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, role FROM users ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// ================= UPDATE ROLE =================
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);

    res.json({ message: "User role updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user role",
      error: error.message,
    });
  }
};

// ================= DELETE USER =================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

module.exports = {
  login,
  register,
  getAllUsers,
  updateUserRole,
  deleteUser,
};