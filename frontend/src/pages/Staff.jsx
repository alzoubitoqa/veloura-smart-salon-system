import { useEffect, useState } from "react";
import API from "../services/api";

function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newStaff, setNewStaff] = useState({
    name: "",
    specialty: "",
    speed: "Medium",
    status: "Available",
    performance: "Good",
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await API.get("/staff");
      setStaffList(res.data);
    } catch (error) {
      console.error("Error fetching staff", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();

    if (!newStaff.name || !newStaff.specialty) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await API.post("/staff", newStaff);

      setNewStaff({
        name: "",
        specialty: "",
        speed: "Medium",
        status: "Available",
        performance: "Good",
      });

      setShowForm(false);
      fetchStaff();
    } catch (error) {
      console.error("Error adding staff", error);
    }
  };

  const filteredStaff = staffList.filter((staff) =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status) => {
    const normalized = String(status).toLowerCase();
    if (normalized === "available") return "completed";
    if (normalized === "busy") return "pending";
    return "cancelled";
  };

  const getSpeedClass = (speed) => {
    const normalized = String(speed).toLowerCase();
    if (normalized === "fast") return "confirmed";
    if (normalized === "medium") return "pending";
    return "cancelled";
  };

  return (
    <div className="staff-page premium-page">
      <div className="page-hero">
        <div>
          <p className="dashboard-label">Veloura Team Performance</p>
          <h2>Premium staff management and service efficiency tracking</h2>
          <p className="dashboard-subtitle">
            Monitor specialties, speed, availability, and performance to keep
            the salon running with precision.
          </p>
        </div>

        <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "+ Add Staff"}
        </button>
      </div>

      <div className="toolbar premium-toolbar">
        <input
          type="text"
          placeholder="Search staff by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {showForm && (
        <form className="client-form premium-form" onSubmit={handleAddStaff}>
          <div className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Staff Name"
              value={newStaff.name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="specialty"
              placeholder="Specialty"
              value={newStaff.specialty}
              onChange={handleChange}
            />

            <select
              name="speed"
              value={newStaff.speed}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Slow">Slow</option>
              <option value="Medium">Medium</option>
              <option value="Fast">Fast</option>
            </select>

            <select
              name="status"
              value={newStaff.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Off">Off</option>
            </select>

            <select
              name="performance"
              value={newStaff.performance}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Good">Good</option>
              <option value="Very Good">Very Good</option>
              <option value="Excellent">Excellent</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              Save Staff
            </button>
          </div>
        </form>
      )}

      <div className="table-card premium-table-card">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialty</th>
              <th>Speed</th>
              <th>Status</th>
              <th>Performance</th>
            </tr>
          </thead>

          <tbody>
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff) => (
                <tr key={staff.id}>
                  <td>
                    <div className="client-name-cell">
                      <div className="client-avatar">
                        {staff.name ? staff.name.charAt(0).toUpperCase() : "S"}
                      </div>
                      <span>{staff.name}</span>
                    </div>
                  </td>
                  <td>{staff.specialty}</td>
                  <td>
                    <span className={`status-badge ${getSpeedClass(staff.speed)}`}>
                      {staff.speed}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(staff.status)}`}>
                      {staff.status}
                    </span>
                  </td>
                  <td>{staff.performance}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  No staff members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Staff;