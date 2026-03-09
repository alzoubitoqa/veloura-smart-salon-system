import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        clientsRes,
        appointmentsRes,
        inventoryRes,
        staffRes,
        notificationsRes,
      ] = await Promise.all([
        API.get("/clients"),
        API.get("/appointments"),
        API.get("/inventory"),
        API.get("/staff"),
        API.get("/notifications"),
      ]);

      setClients(clientsRes.data);
      setAppointments(appointmentsRes.data);
      setInventoryItems(inventoryRes.data);
      setStaffList(staffRes.data);
      setNotifications(notificationsRes.data.notifications || []);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const todayAppointments = appointments.filter(
    (appointment) => String(appointment.date).split("T")[0] === today
  );

  const lowStockItems = inventoryItems.filter(
    (item) => Number(item.quantity) <= Number(item.minLevel)
  );

  const availableStaff = staffList.filter(
    (staff) => staff.status === "Available"
  );

  const vipClients = clients.filter(
    (client) => client.loyaltyLevel === "VIP"
  );

  const cards = [
    { title: "Total Clients", value: clients.length },
    { title: "Today Appointments", value: todayAppointments.length },
    { title: "Available Staff", value: availableStaff.length },
    { title: "Low Stock Alerts", value: lowStockItems.length },
  ];

  return (
    <div className="dashboard">
      <div className="cards-grid">
        {cards.map((card) => (
          <div key={card.title} className="card">
            <h3>{card.title}</h3>
            <p>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="panel">
          <h3>Today’s Appointments</h3>
          <ul>
            {todayAppointments.length > 0 ? (
              todayAppointments.map((item) => (
                <li key={item.id}>
                  {item.time ? String(item.time).slice(0, 5) : ""} - {item.service} - {item.clientName}
                </li>
              ))
            ) : (
              <li>No appointments for today.</li>
            )}
          </ul>
        </div>

        <div className="panel">
          <h3>Inventory Alerts</h3>
          <ul>
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item) => (
                <li key={item.id}>
                  {item.name} - Low Stock
                </li>
              ))
            ) : (
              <li>No low stock alerts.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="dashboard-sections" style={{ marginTop: "18px" }}>
        <div className="panel">
          <h3>VIP Clients</h3>
          <ul>
            {vipClients.length > 0 ? (
              vipClients.map((client) => (
                <li key={client.id}>
                  {client.name} - {client.preferredService || client.service}
                </li>
              ))
            ) : (
              <li>No VIP clients yet.</li>
            )}
          </ul>
        </div>

        <div className="panel">
          <h3>Smart Insights</h3>
          <ul>
            <li>VIP clients: {vipClients.length}</li>
            <li>Available staff now: {availableStaff.length}</li>
            <li>Low stock items: {lowStockItems.length}</li>
            <li>Today bookings: {todayAppointments.length}</li>
          </ul>
        </div>
      </div>

      <div className="panel" style={{ marginTop: "18px" }}>
        <h3>Smart Notifications</h3>
        <ul>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <li key={index}>{notification.message}</li>
            ))
          ) : (
            <li>No notifications right now.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;