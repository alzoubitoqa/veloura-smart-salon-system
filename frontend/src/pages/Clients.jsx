import { useState, useEffect } from "react";
import API from "../services/api";

function Clients() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  const [smartSuggestion, setSmartSuggestion] = useState("");

  const [newClient, setNewClient] = useState({
    name: "",
    phone: "",
    service: "",
    lastVisit: "",
    notes: "",
    visits: 1,
    loyaltyLevel: "Regular",
    preferredService: "",
    lastOffer: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await API.get("/clients");
      setClients(res.data);
    } catch (error) {
      console.error("Error fetching clients", error);
    }
  };

  const generateSmartOffer = (service, visits) => {
    const totalVisits = Number(visits) || 1;

    if (totalVisits >= 10) {
      return `VIP loyalty offer for ${service || "premium services"}`;
    }

    if (totalVisits >= 5) {
      return `15% discount on next ${service || "visit"}`;
    }

    return `Welcome-back offer for ${service || "selected services"}`;
  };

  const calculateLoyaltyLevel = (visits) => {
    const totalVisits = Number(visits) || 1;

    if (totalVisits >= 10) return "VIP";
    if (totalVisits >= 5) return "Gold";
    return "Regular";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewClient((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      const calculatedVisits = name === "visits" ? value : updated.visits;
      const calculatedService =
        name === "preferredService"
          ? value
          : updated.preferredService || updated.service;

      updated.loyaltyLevel = calculateLoyaltyLevel(calculatedVisits);
      updated.lastOffer = generateSmartOffer(calculatedService, calculatedVisits);

      return updated;
    });

    if (name === "visits" || name === "preferredService" || name === "service") {
      const serviceName =
        name === "preferredService"
          ? value
          : name === "service"
          ? value
          : newClient.preferredService || newClient.service;

      const visitsValue = name === "visits" ? value : newClient.visits;

      setSmartSuggestion(generateSmartOffer(serviceName, visitsValue));
    }
  };

  const resetForm = () => {
    setNewClient({
      name: "",
      phone: "",
      service: "",
      lastVisit: "",
      notes: "",
      visits: 1,
      loyaltyLevel: "Regular",
      preferredService: "",
      lastOffer: "",
    });
    setEditingClientId(null);
    setSmartSuggestion("");
    setShowForm(false);
  };

  const handleAddOrUpdateClient = async (e) => {
    e.preventDefault();

    if (!newClient.name || !newClient.phone || !newClient.service || !newClient.lastVisit) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        ...newClient,
        visits: Number(newClient.visits) || 1,
        preferredService: newClient.preferredService || newClient.service,
        loyaltyLevel: calculateLoyaltyLevel(newClient.visits),
        lastOffer: generateSmartOffer(
          newClient.preferredService || newClient.service,
          newClient.visits
        ),
      };

      if (editingClientId) {
        await API.put(`/clients/${editingClientId}`, payload);
      } else {
        await API.post("/clients", payload);
      }

      resetForm();
      fetchClients();
    } catch (error) {
      console.error("Error saving client", error);
    }
  };

  const handleEditClient = (client) => {
    setNewClient({
      name: client.name || "",
      phone: client.phone || "",
      service: client.service || "",
      lastVisit: client.lastVisit ? String(client.lastVisit).split("T")[0] : "",
      notes: client.notes || "",
      visits: client.visits || 1,
      loyaltyLevel: client.loyaltyLevel || "Regular",
      preferredService: client.preferredService || "",
      lastOffer: client.lastOffer || "",
    });

    setEditingClientId(client.id);
    setSmartSuggestion(client.lastOffer || "");
    setShowForm(true);
  };

  const handleDeleteClient = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this client?");
    if (!confirmed) return;

    try {
      await API.delete(`/clients/${id}`);
      fetchClients();
    } catch (error) {
      console.error("Error deleting client", error);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLoyaltyClass = (level) => {
    if (level === "VIP") return "confirmed";
    if (level === "Gold") return "pending";
    return "completed";
  };

  return (
    <div className="clients-page premium-page">
      <div className="page-hero">
        <div>
          <p className="dashboard-label">Veloura Client Experience</p>
          <h2>Client memory, loyalty, and premium service tracking</h2>
          <p className="dashboard-subtitle">
            Manage clients with visit history, loyalty intelligence, and smart offers.
          </p>
        </div>

        <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "+ Add Client"}
        </button>
      </div>

      <div className="toolbar premium-toolbar">
        <input
          type="text"
          placeholder="Search client by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {showForm && (
        <form className="client-form premium-form" onSubmit={handleAddOrUpdateClient}>
          <div className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Client Name"
              value={newClient.name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={newClient.phone}
              onChange={handleChange}
            />

            <input
              type="text"
              name="service"
              placeholder="Last Service"
              value={newClient.service}
              onChange={handleChange}
            />

            <input
              type="date"
              name="lastVisit"
              value={newClient.lastVisit}
              onChange={handleChange}
            />

            <input
              type="number"
              name="visits"
              placeholder="Total Visits"
              value={newClient.visits}
              onChange={handleChange}
            />

            <input
              type="text"
              name="preferredService"
              placeholder="Preferred Service"
              value={newClient.preferredService}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="notes"
            placeholder="Client Notes"
            value={newClient.notes}
            onChange={handleChange}
            rows="4"
          ></textarea>

          <div className="smart-grid">
            <div className="smart-box">
              <h4>Loyalty Level</h4>
              <p>{newClient.loyaltyLevel || "Regular"}</p>
            </div>

            <div className="smart-box">
              <h4>Suggested Offer</h4>
              <p>
                {smartSuggestion ||
                  newClient.lastOffer ||
                  "Offer will be generated automatically."}
              </p>
            </div>

            <div className="smart-box">
              <h4>Client Memory</h4>
              <p>
                Preferred Service:{" "}
                {newClient.preferredService || newClient.service || "Not set yet"}
              </p>
            </div>
          </div>

          <div className="form-actions form-actions-between">
            <button type="button" className="secondary-btn" onClick={resetForm}>
              Cancel
            </button>

            <button type="submit" className="primary-btn">
              {editingClientId ? "Update Client" : "Save Client"}
            </button>
          </div>
        </form>
      )}

      <div className="table-card premium-table-card">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Last Service</th>
              <th>Visits</th>
              <th>Loyalty</th>
              <th>Preferred Service</th>
              <th>Last Offer</th>
              <th>Last Visit</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div className="client-name-cell">
                      <div className="client-avatar">
                        {client.name ? client.name.charAt(0).toUpperCase() : "C"}
                      </div>
                      <span>{client.name}</span>
                    </div>
                  </td>
                  <td>{client.phone}</td>
                  <td>{client.service}</td>
                  <td>{client.visits}</td>
                  <td>
                    <span
                      className={`status-badge ${getLoyaltyClass(client.loyaltyLevel)}`}
                    >
                      {client.loyaltyLevel}
                    </span>
                  </td>
                  <td>{client.preferredService || "-"}</td>
                  <td>{client.lastOffer || "-"}</td>
                  <td>{client.lastVisit ? String(client.lastVisit).split("T")[0] : ""}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditClient(client)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="empty-state">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clients;