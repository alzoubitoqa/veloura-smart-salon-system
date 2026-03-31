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
    (staff) => String(staff.status).toLowerCase() === "available"
  );

  const vipClients = clients.filter(
    (client) => client.loyaltyLevel === "VIP"
  );

  const pendingAppointments = appointments.filter(
    (appointment) => String(appointment.status).toLowerCase() === "pending"
  );

  const cards = [
    {
      title: "Total Clients",
      value: clients.length,
      subtitle: "Registered salon clients",
    },
    {
      title: "Today Appointments",
      value: todayAppointments.length,
      subtitle: "Scheduled for today",
    },
    {
      title: "Available Staff",
      value: availableStaff.length,
      subtitle: "Ready for service",
    },
    {
      title: "Low Stock Alerts",
      value: lowStockItems.length,
      subtitle: "Need attention",
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero">
        <div>
          <p className="dashboard-label">Veloura Salon Overview</p>
          <h2>Luxury salon operations at a glance</h2>
          <p className="dashboard-subtitle">
            Monitor appointments, stock, clients, and team activity from one
            elegant dashboard.
          </p>
        </div>

        <div className="dashboard-hero-stats">
          <div className="hero-mini-card">
            <span>VIP Clients</span>
            <strong>{vipClients.length}</strong>
          </div>
          <div className="hero-mini-card">
            <span>Pending Bookings</span>
            <strong>{pendingAppointments.length}</strong>
          </div>
        </div>
      </div>

      <div className="cards-grid premium-cards-grid">
        {cards.map((card) => (
          <div key={card.title} className="card premium-card">
            <div className="card-top-line"></div>
            <h3>{card.title}</h3>
            <p>{card.value}</p>
            <span className="card-subtitle">{card.subtitle}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="panel premium-panel">
          <div className="panel-header">
            <h3>Today’s Appointments</h3>
            <span className="panel-badge">{todayAppointments.length}</span>
          </div>

          <ul>
            {todayAppointments.length > 0 ? (
              todayAppointments.map((item) => (
                <li key={item.id} className="dashboard-list-item">
                  <div>
                    <strong>{item.clientName}</strong>
                    <p>{item.service}</p>
                  </div>
                  <span>
                    {item.time ? String(item.time).slice(0, 5) : "--:--"}
                  </span>
                </li>
              ))
            ) : (
              <li>No appointments for today.</li>
            )}
          </ul>
        </div>

        <div className="panel premium-panel">
          <div className="panel-header">
            <h3>Inventory Alerts</h3>
            <span className="panel-badge danger-badge">{lowStockItems.length}</span>
          </div>

          <ul>
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item) => (
                <li key={item.id} className="dashboard-list-item">
                  <div>
                    <strong>{item.name}</strong>
                    <p>{item.category}</p>
                  </div>
                  <span className="danger-text">
                    {item.quantity} {item.unit}
                  </span>
                </li>
              ))
            ) : (
              <li>No low stock alerts.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="dashboard-sections dashboard-sections-bottom">
        <div className="panel premium-panel">
          <div className="panel-header">
            <h3>VIP Clients</h3>
            <span className="panel-badge">{vipClients.length}</span>
          </div>

          <ul>
            {vipClients.length > 0 ? (
              vipClients.map((client) => (
                <li key={client.id} className="dashboard-list-item">
                  <div>
                    <strong>{client.name}</strong>
                    <p>{client.preferredService || client.service || "No preferred service"}</p>
                  </div>
                  <span className="vip-text">VIP</span>
                </li>
              ))
            ) : (
              <li>No VIP clients yet.</li>
            )}
          </ul>
        </div>

        <div className="panel premium-panel">
          <div className="panel-header">
            <h3>Smart Notifications</h3>
            <span className="panel-badge info-badge">{notifications.length}</span>
          </div>

          <ul>
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification, index) => (
                <li key={index} className="notification-item">
                  {notification.message}
                </li>
              ))
            ) : (
              <li>No notifications right now.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;