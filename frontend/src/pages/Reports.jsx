import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

function Reports() {
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [staff, setStaff] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      const [clientsRes, appointmentsRes, inventoryRes, staffRes, aiRes] =
        await Promise.all([
          API.get("/clients"),
          API.get("/appointments"),
          API.get("/inventory"),
          API.get("/staff"),
          API.get("/ai/analysis"),
        ]);

      setClients(clientsRes.data);
      setAppointments(appointmentsRes.data);
      setInventory(inventoryRes.data);
      setStaff(staffRes.data);
      setAiAnalysis(aiRes.data);
    } catch (error) {
      console.error("Error fetching reports", error);
    }
  };

  const vipClients = clients.filter((c) => c.loyaltyLevel === "VIP");

  const completedAppointments = appointments.filter(
    (a) => String(a.status).toLowerCase() === "completed"
  );

  const completionRate =
    appointments.length > 0
      ? Math.round((completedAppointments.length / appointments.length) * 100)
      : 0;

  const lowStockItems = inventory.filter(
    (item) => Number(item.quantity) <= Number(item.minLevel)
  );

  const mostPopularService = useMemo(() => {
    const counter = {};

    appointments.forEach((a) => {
      if (!a.service) return;
      counter[a.service] = (counter[a.service] || 0) + 1;
    });

    let maxService = null;
    let maxCount = 0;

    Object.entries(counter).forEach(([service, count]) => {
      if (count > maxCount) {
        maxService = service;
        maxCount = count;
      }
    });

    return maxService ? `${maxService} (${maxCount})` : "No data yet";
  }, [appointments]);

  const topStaff = useMemo(() => {
    const counter = {};

    appointments.forEach((a) => {
      if (!a.staff) return;
      counter[a.staff] = (counter[a.staff] || 0) + 1;
    });

    let best = null;
    let max = 0;

    Object.entries(counter).forEach(([staffName, count]) => {
      if (count > max) {
        best = staffName;
        max = count;
      }
    });

    return best ? `${best} (${max})` : "No data yet";
  }, [appointments]);

  const topClient = useMemo(() => {
    if (!clients.length) return "No data";

    const sorted = [...clients].sort(
      (a, b) => (b.visits || 0) - (a.visits || 0)
    );

    const best = sorted[0];
    return best ? `${best.name} (${best.visits} visits)` : "No data";
  }, [clients]);

  const cards = [
    { title: "Total Clients", value: clients.length, subtitle: "Client records" },
    { title: "VIP Clients", value: vipClients.length, subtitle: "High-value loyalty" },
    { title: "Appointments", value: appointments.length, subtitle: "All bookings" },
    { title: "Completion Rate", value: `${completionRate}%`, subtitle: "Operational efficiency" },
  ];

  return (
    <div className="reports-page premium-page">
      <div className="page-hero">
        <div>
          <p className="dashboard-label">Veloura Business Intelligence</p>
          <h2>Smart reports and premium operational insights</h2>
          <p className="dashboard-subtitle">
            Analyze salon performance, team activity, stock risk, and AI-powered recommendations.
          </p>
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
            <h3>Business Insights</h3>
            <span className="panel-badge">{clients.length}</span>
          </div>

          <ul>
            <li className="notification-item">Most popular service: {mostPopularService}</li>
            <li className="notification-item">Top performing staff: {topStaff}</li>
            <li className="notification-item">Most loyal client: {topClient}</li>
            <li className="notification-item">VIP clients: {vipClients.length}</li>
          </ul>
        </div>

        <div className="panel premium-panel">
          <div className="panel-header">
            <h3>Operational Alerts</h3>
            <span className="panel-badge danger-badge">{lowStockItems.length}</span>
          </div>

          <ul>
            <li className="notification-item">Total appointments: {appointments.length}</li>
            <li className="notification-item">Completed appointments: {completedAppointments.length}</li>
            <li className="notification-item">Completion rate: {completionRate}%</li>
            <li className="notification-item">Low stock items: {lowStockItems.length}</li>
          </ul>
        </div>
      </div>

      <div className="dashboard-sections dashboard-sections-bottom">
        <div className="panel premium-panel">
          <div className="panel-header">
            <h3>AI Peak & Loyalty Analysis</h3>
            <span className="panel-badge info-badge">AI</span>
          </div>

          <ul>
            <li className="notification-item">
              Peak hour: {aiAnalysis?.peak_analysis?.peak_hour || "No data"}
            </li>
            <li className="notification-item">
              Peak bookings: {aiAnalysis?.peak_analysis?.peak_bookings ?? 0}
            </li>
            <li className="notification-item">
              VIP ratio: {aiAnalysis?.loyalty_analysis?.vip_ratio ?? 0}%
            </li>
            <li className="notification-item">
              Top preferred service: {aiAnalysis?.loyalty_analysis?.top_preferred_service || "No data"}
            </li>
          </ul>
        </div>

        <div className="panel premium-panel">
          <div className="panel-header">
            <h3>AI Stock Risk Analysis</h3>
            <span className="panel-badge danger-badge">
              {aiAnalysis?.stock_analysis?.critical_stock_count ?? 0}
            </span>
          </div>

          <ul>
            <li className="notification-item">
              Low stock count: {aiAnalysis?.stock_analysis?.low_stock_count ?? 0}
            </li>
            <li className="notification-item">
              Critical stock count: {aiAnalysis?.stock_analysis?.critical_stock_count ?? 0}
            </li>
            {aiAnalysis?.stock_analysis?.critical_stock_items?.length > 0 ? (
              aiAnalysis.stock_analysis.critical_stock_items.map((item, index) => (
                <li key={index} className="notification-item">
                  {item} needs urgent reorder
                </li>
              ))
            ) : (
              <li className="notification-item">No critical stock items.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="panel premium-panel">
        <div className="panel-header">
          <h3>AI Recommendations</h3>
          <span className="panel-badge info-badge">
            {aiAnalysis?.recommendations?.length || 0}
          </span>
        </div>

        <ul>
          {aiAnalysis?.recommendations?.length > 0 ? (
            aiAnalysis.recommendations.map((item, index) => (
              <li key={index} className="notification-item">
                {item}
              </li>
            ))
          ) : (
            <li className="notification-item">No AI recommendations yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Reports;