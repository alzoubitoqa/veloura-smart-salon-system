const db = require("../config/db");

const getNotifications = async (req, res) => {
  try {
    const [clients] = await db.query("SELECT * FROM clients");
    const [inventory] = await db.query("SELECT * FROM inventory");
    const [appointments] = await db.query("SELECT * FROM appointments");

    const notifications = [];

    const today = new Date();

    // Clients inactive 30 days
    clients.forEach((client) => {
      if (!client.lastVisit) return;

      const lastVisitDate = new Date(client.lastVisit);
      const diffDays = (today - lastVisitDate) / (1000 * 60 * 60 * 24);

      if (diffDays > 30) {
        notifications.push({
          type: "client_return",
          message: `${client.name} hasn't visited in over 30 days. Send a comeback offer.`,
        });
      }
    });

    // Low stock
    inventory.forEach((item) => {
      if (item.quantity <= item.minLevel) {
        notifications.push({
          type: "inventory",
          message: `${item.name} stock is low (${item.quantity} ${item.unit} left).`,
        });
      }
    });

    // VIP clients
    clients.forEach((client) => {
      if (client.loyaltyLevel === "VIP") {
        notifications.push({
          type: "vip",
          message: `VIP client ${client.name} may need personalized follow-up.`,
        });
      }
    });

    // Busy hour detection
    const hourCounter = {};

    appointments.forEach((a) => {
      const hour = String(a.time).slice(0, 2);
      hourCounter[hour] = (hourCounter[hour] || 0) + 1;
    });

    Object.entries(hourCounter).forEach(([hour, count]) => {
      if (count >= 5) {
        notifications.push({
          type: "peak",
          message: `High booking volume around ${hour}:00. Consider assigning more staff.`,
        });
      }
    });

    res.json({
      total: notifications.length,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate notifications",
      error: error.message,
    });
  }
};

module.exports = {
  getNotifications,
};