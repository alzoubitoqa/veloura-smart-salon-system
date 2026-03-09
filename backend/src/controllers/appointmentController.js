const db = require("../config/db");

const getAllAppointments = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM appointments ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

const createAppointment = async (req, res) => {
  try {
    const {
      clientName,
      service,
      staff,
      date,
      time,
      status,
      estimatedDuration,
      endTime,
    } = req.body;

    const sql = `
      INSERT INTO appointments
      (clientName, service, staff, date, time, status, estimatedDuration, endTime)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      clientName,
      service,
      staff,
      date,
      time,
      status,
      estimatedDuration || null,
      endTime || null,
    ]);

    res.status(201).json({
      message: "Appointment added successfully",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create appointment",
      error: error.message,
    });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      clientName,
      service,
      staff,
      date,
      time,
      status,
      estimatedDuration,
      endTime,
    } = req.body;

    const sql = `
      UPDATE appointments
      SET clientName = ?, service = ?, staff = ?, date = ?, time = ?, status = ?, estimatedDuration = ?, endTime = ?
      WHERE id = ?
    `;

    await db.query(sql, [
      clientName,
      service,
      staff,
      date,
      time,
      status,
      estimatedDuration || null,
      endTime || null,
      id,
    ]);

    res.json({ message: "Appointment updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update appointment",
      error: error.message,
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM appointments WHERE id = ?", [id]);

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete appointment",
      error: error.message,
    });
  }
};

module.exports = {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};