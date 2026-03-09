const db = require("../config/db");

const getAllClients = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM clients ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch clients",
      error: error.message,
    });
  }
};

const createClient = async (req, res) => {
  try {
    const {
      name,
      phone,
      service,
      lastVisit,
      notes,
      visits,
      loyaltyLevel,
      preferredService,
      lastOffer,
    } = req.body;

    const sql = `
      INSERT INTO clients
      (name, phone, service, lastVisit, notes, visits, loyaltyLevel, preferredService, lastOffer)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      name,
      phone,
      service,
      lastVisit,
      notes || null,
      visits || 1,
      loyaltyLevel || "Regular",
      preferredService || service || null,
      lastOffer || null,
    ]);

    res.status(201).json({
      message: "Client added successfully",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create client",
      error: error.message,
    });
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      phone,
      service,
      lastVisit,
      notes,
      visits,
      loyaltyLevel,
      preferredService,
      lastOffer,
    } = req.body;

    const sql = `
      UPDATE clients
      SET
        name = ?,
        phone = ?,
        service = ?,
        lastVisit = ?,
        notes = ?,
        visits = ?,
        loyaltyLevel = ?,
        preferredService = ?,
        lastOffer = ?
      WHERE id = ?
    `;

    await db.query(sql, [
      name,
      phone,
      service,
      lastVisit,
      notes || null,
      visits || 1,
      loyaltyLevel || "Regular",
      preferredService || service || null,
      lastOffer || null,
      id,
    ]);

    res.json({ message: "Client updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update client",
      error: error.message,
    });
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM clients WHERE id = ?", [id]);
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete client",
      error: error.message,
    });
  }
};

module.exports = {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
};