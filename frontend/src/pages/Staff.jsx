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
    if (status === "Available") return "completed";
    if (status === "Busy") return "pending";
    return "cancelled";
  };

  return (
    <div className="staff-page">
      <div className="page-header">
        <div>
          <h2>Staff Management</h2>
          <p>Manage employees, specialties, availability, and performance.</p>
        </div>

        <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "+ Add Staff"}
        </button>
      </div>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {showForm && (
        <form className="client-form" onSubmit={handleAddStaff}>
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

      <div className="table-card">
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
                  <td>{staff.name}</td>
                  <td>{staff.specialty}</td>
                  <td>{staff.speed}</td>
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