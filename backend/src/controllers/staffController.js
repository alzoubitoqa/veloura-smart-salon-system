const db = require("../config/db");

const getAllStaff = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM staff ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch staff", error: error.message });
  }
};

const createStaff = async (req, res) => {
  try {
    const { name, specialty, speed, status, performance } = req.body;

    const sql = `
      INSERT INTO staff (name, specialty, speed, status, performance)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [name, specialty, speed, status, performance]);

    res.status(201).json({
      message: "Staff member added successfully",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create staff member", error: error.message });
  }
};

module.exports = {
  getAllStaff,
  createStaff,
};