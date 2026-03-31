const axios = require("axios");
const db = require("../config/db");

const getSmartAnalysis = async (req, res) => {
  try {
    const [clients] = await db.query("SELECT * FROM clients");
    const [appointments] = await db.query("SELECT * FROM appointments");
    const [inventory] = await db.query("SELECT * FROM inventory");

    const aiResponse = await axios.post(`${process.env.AI_ENGINE_URL}/analyze`, {
      clients,
      appointments,
      inventory,
    });

    res.json(aiResponse.data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get AI analysis",
      error: error.message,
    });
  }
};

module.exports = {
  getSmartAnalysis,
};