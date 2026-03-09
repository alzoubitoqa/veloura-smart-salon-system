import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import servicesData from "../data/servicesData";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [recommendedStaff, setRecommendedStaff] = useState("");
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);

  const [newAppointment, setNewAppointment] = useState({
    clientName: "",
    service: "",
    staff: "",
    date: "",
    time: "",
    status: "Pending",
    estimatedDuration: "",
    endTime: "",
  });

  useEffect(() => {
    fetchAppointments();
    fetchStaff();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments");
      setAppointments(res.data);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await API.get("/staff");
      setStaffList(res.data);
    } catch (error) {
      console.error("Error fetching staff", error);
    }
  };

  const speedRank = useMemo(
    () => ({
      Fast: 3,
      Medium: 2,
      Slow: 1,
    }),
    []
  );

  const speedMultiplier = useMemo(
    () => ({
      Fast: 0.8,
      Medium: 1,
      Slow: 1.2,
    }),
    []
  );

  const calculateEndTime = (startTime, durationMinutes) => {
    if (!startTime || !durationMinutes) return "";

    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + Number(durationMinutes);

    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;

    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
  };

  const findServiceBaseDuration = (serviceName) => {
    const match = servicesData.find(
      (service) => service.name.toLowerCase() === serviceName.toLowerCase().trim()
    );

    return match ? match.baseDuration : null;
  };

  const calculateEstimatedDuration = (serviceName, staffName) => {
    const baseDuration = findServiceBaseDuration(serviceName);
    if (!baseDuration) return "";

    const selectedStaff = staffList.find((staff) => staff.name === staffName);
    const multiplier = selectedStaff ? speedMultiplier[selectedStaff.speed] || 1 : 1;

    return Math.round(baseDuration * multiplier);
  };

  const suggestBestStaff = (serviceName, currentTime = "") => {
    if (!serviceName.trim()) {
      setRecommendedStaff("");
      return;
    }

    const normalizedService = serviceName.toLowerCase().trim();

    const matchedAvailableStaff = staffList
      .filter(
        (staff) =>
          staff.status === "Available" &&
          staff.specialty.toLowerCase().includes(normalizedService)
      )
      .sort((a, b) => (speedRank[b.speed] || 0) - (speedRank[a.speed] || 0));

    let best = null;

    if (matchedAvailableStaff.length > 0) {
      best = matchedAvailableStaff[0];
      setRecommendedStaff(best.name);
    } else {
      const fallbackAvailableStaff = staffList
        .filter((staff) => staff.status === "Available")
        .sort((a, b) => (speedRank[b.speed] || 0) - (speedRank[a.speed] || 0));

      if (fallbackAvailableStaff.length > 0) {
        best = fallbackAvailableStaff[0];
        setRecommendedStaff(`${best.name} (best available match)`);
      } else {
        setRecommendedStaff("No available staff right now");
        return;
      }
    }

    const estimatedDuration = calculateEstimatedDuration(serviceName, best.name);
    const endTime = calculateEndTime(currentTime, estimatedDuration);

    setNewAppointment((prev) => ({
      ...prev,
      staff: best.name,
      estimatedDuration,
      endTime,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewAppointment((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      const serviceName = name === "service" ? value : updated.service;
      const staffName = name === "staff" ? value : updated.staff;
      const timeValue = name === "time" ? value : updated.time;

      const estimatedDuration = calculateEstimatedDuration(serviceName, staffName);
      const endTime = calculateEndTime(timeValue, estimatedDuration);

      updated.estimatedDuration = estimatedDuration;
      updated.endTime = endTime;

      return updated;
    });

    if (name === "service") {
      suggestBestStaff(value, name === "time" ? value : newAppointment.time);
    }

    if (name === "time" && newAppointment.service) {
      suggestBestStaff(newAppointment.service, value);
    }
  };

  const resetForm = () => {
    setNewAppointment({
      clientName: "",
      service: "",
      staff: "",
      date: "",
      time: "",
      status: "Pending",
      estimatedDuration: "",
      endTime: "",
    });
    setRecommendedStaff("");
    setEditingAppointmentId(null);
    setShowForm(false);
  };

  const handleAddOrUpdateAppointment = async (e) => {
    e.preventDefault();

    if (
      !newAppointment.clientName ||
      !newAppointment.service ||
      !newAppointment.staff ||
      !newAppointment.date ||
      !newAppointment.time
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        ...newAppointment,
        estimatedDuration: Number(newAppointment.estimatedDuration) || null,
      };

      if (editingAppointmentId) {
        await API.put(`/appointments/${editingAppointmentId}`, payload);
      } else {
        await API.post("/appointments", payload);
      }

      resetForm();
      fetchAppointments();
    } catch (error) {
      console.error("Error saving appointment", error);
    }
  };

  const handleEditAppointment = (appointment) => {
    setNewAppointment({
      clientName: appointment.clientName || "",
      service: appointment.service || "",
      staff: appointment.staff || "",
      date: appointment.date ? String(appointment.date).split("T")[0] : "",
      time: appointment.time ? String(appointment.time).slice(0, 5) : "",
      status: appointment.status || "Pending",
      estimatedDuration: appointment.estimatedDuration || "",
      endTime: appointment.endTime ? String(appointment.endTime).slice(0, 5) : "",
    });

    setEditingAppointmentId(appointment.id);
    setRecommendedStaff(appointment.staff || "");
    setShowForm(true);
  };

  const handleDeleteAppointment = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmed) return;

    try {
      await API.delete(`/appointments/${id}`);
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment", error);
    }
  };

  const filteredAppointments = filterDate
    ? appointments.filter(
        (appointment) => String(appointment.date).split("T")[0] === filterDate
      )
    : appointments;

  return (
    <div className="appointments-page">
      <div className="page-header">
        <div>
          <h2>Appointments Management</h2>
          <p>Manage salon bookings with smart staff and duration estimation.</p>
        </div>

        <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "+ Add Appointment"}
        </button>
      </div>

      <div className="toolbar">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="search-input"
        />
      </div>

      {showForm && (
        <form className="client-form" onSubmit={handleAddOrUpdateAppointment}>
          <div className="form-grid">
            <input
              type="text"
              name="clientName"
              placeholder="Client Name"
              value={newAppointment.clientName}
              onChange={handleChange}
            />

            <select
              name="service"
              value={newAppointment.service}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select Service</option>
              {servicesData.map((service) => (
                <option key={service.name} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="staff"
              placeholder="Assigned Staff"
              value={newAppointment.staff}
              onChange={handleChange}
            />

            <input
              type="date"
              name="date"
              value={newAppointment.date}
              onChange={handleChange}
            />

            <input
              type="time"
              name="time"
              value={newAppointment.time}
              onChange={handleChange}
            />

            <select
              name="status"
              value={newAppointment.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="smart-grid">
            <div className="smart-box">
              <h4>Smart Recommendation</h4>
              <p>
                {recommendedStaff
                  ? `Recommended staff: ${recommendedStaff}`
                  : "Choose a service to get the best available staff recommendation."}
              </p>
            </div>

            <div className="smart-box">
              <h4>Estimated Duration</h4>
              <p>
                {newAppointment.estimatedDuration
                  ? `${newAppointment.estimatedDuration} minutes`
                  : "Duration will appear automatically."}
              </p>
            </div>

            <div className="smart-box">
              <h4>Expected End Time</h4>
              <p>
                {newAppointment.endTime
                  ? newAppointment.endTime
                  : "End time will be calculated automatically."}
              </p>
            </div>
          </div>

          <div className="form-actions form-actions-between">
            <button type="button" className="secondary-btn" onClick={resetForm}>
              Cancel
            </button>

            <button type="submit" className="primary-btn">
              {editingAppointmentId ? "Update Appointment" : "Save Appointment"}
            </button>
          </div>
        </form>
      )}

      <div className="table-card">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Service</th>
              <th>Staff</th>
              <th>Date</th>
              <th>Start</th>
              <th>Duration</th>
              <th>End</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.clientName}</td>
                  <td>{appointment.service}</td>
                  <td>{appointment.staff}</td>
                  <td>{appointment.date ? String(appointment.date).split("T")[0] : ""}</td>
                  <td>{appointment.time ? String(appointment.time).slice(0, 5) : ""}</td>
                  <td>
                    {appointment.estimatedDuration
                      ? `${appointment.estimatedDuration} min`
                      : "-"}
                  </td>
                  <td>{appointment.endTime ? String(appointment.endTime).slice(0, 5) : "-"}</td>
                  <td>
                    <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteAppointment(appointment.id)}
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
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Appointments;