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
    (a) => a.status === "Completed"
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

    return maxService
      ? `${maxService} (${maxCount} bookings)`
      : "No data yet";
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

    return best ? `${best} (${max} appointments)` : "No data yet";
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
    { title: "Total Clients", value: clients.length },
    { title: "VIP Clients", value: vipClients.length },
    { title: "Appointments", value: appointments.length },
    { title: "Completion Rate", value: `${completionRate}%` },
  ];

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h2>Smart Reports & Insights</h2>
          <p>Operational analytics powered by salon data and AI.</p>
        </div>
      </div>

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
          <h3>Business Insights</h3>
          <ul>
            <li>Most popular service: {mostPopularService}</li>
            <li>Top performing staff: {topStaff}</li>
            <li>Most loyal client: {topClient}</li>
            <li>VIP clients: {vipClients.length}</li>
          </ul>
        </div>

        <div className="panel">
          <h3>Operational Alerts</h3>
          <ul>
            <li>Total appointments: {appointments.length}</li>
            <li>Completed appointments: {completedAppointments.length}</li>
            <li>Completion rate: {completionRate}%</li>
            <li>Low stock items: {lowStockItems.length}</li>
          </ul>
        </div>
      </div>

      <div className="dashboard-sections" style={{ marginTop: "18px" }}>
        <div className="panel">
          <h3>AI Peak & Loyalty Analysis</h3>
          <ul>
            <li>
              Peak hour: {aiAnalysis?.peak_analysis?.peak_hour || "No data"}
            </li>
            <li>
              Peak bookings: {aiAnalysis?.peak_analysis?.peak_bookings ?? 0}
            </li>
            <li>
              VIP ratio: {aiAnalysis?.loyalty_analysis?.vip_ratio ?? 0}%
            </li>
            <li>
              Top preferred service:{" "}
              {aiAnalysis?.loyalty_analysis?.top_preferred_service || "No data"}
            </li>
          </ul>
        </div>

        <div className="panel">
          <h3>AI Stock Risk Analysis</h3>
          <ul>
            <li>
              Low stock count: {aiAnalysis?.stock_analysis?.low_stock_count ?? 0}
            </li>
            <li>
              Critical stock count:{" "}
              {aiAnalysis?.stock_analysis?.critical_stock_count ?? 0}
            </li>
            {aiAnalysis?.stock_analysis?.critical_stock_items?.length > 0 ? (
              aiAnalysis.stock_analysis.critical_stock_items.map((item, index) => (
                <li key={index}>{item} needs urgent reorder</li>
              ))
            ) : (
              <li>No critical stock items.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="panel" style={{ marginTop: "18px" }}>
        <h3>AI Recommendations</h3>
        <ul>
          {aiAnalysis?.recommendations?.length > 0 ? (
            aiAnalysis.recommendations.map((item, index) => (
              <li key={index}>{item}</li>
            ))
          ) : (
            <li>No AI recommendations yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Reports;