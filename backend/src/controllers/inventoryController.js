const db = require("../config/db");

const getAllInventoryItems = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM inventory ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory", error: error.message });
  }
};

const createInventoryItem = async (req, res) => {
  try {
    const { name, category, quantity, minLevel, unit } = req.body;

    const sql = `
      INSERT INTO inventory (name, category, quantity, minLevel, unit)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [name, category, quantity, minLevel, unit]);

    res.status(201).json({
      message: "Inventory item added successfully",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create inventory item", error: error.message });
  }
};

module.exports = {
  getAllInventoryItems,
  createInventoryItem,
};