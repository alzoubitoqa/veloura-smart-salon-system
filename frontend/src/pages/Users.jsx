import { useEffect, useState } from "react";
import API from "../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", newUser);

      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "staff",
      });

      setShowForm(false);
      fetchUsers();
      alert("User created successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create user");
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await API.put(`/auth/users/${id}`, { role });
      fetchUsers();
    } catch (error) {
      alert("Failed to update role");
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      await API.delete(`/auth/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="users-page premium-page">
      <div className="page-hero">
        <div>
          <p className="dashboard-label">Veloura Access Control</p>
          <h2>Secure user management and team access control</h2>
          <p className="dashboard-subtitle">
            Create system accounts, manage roles, and control access across the salon platform.
          </p>
        </div>

        <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "+ Add User"}
        </button>
      </div>

      {showForm && (
        <form className="client-form premium-form" onSubmit={handleCreateUser}>
          <div className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={newUser.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={newUser.password}
              onChange={handleChange}
            />

            <select
              name="role"
              value={newUser.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="admin">Admin</option>
              <option value="reception">Reception</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              Create User
            </button>
          </div>
        </form>
      )}

      <div className="table-card premium-table-card">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Change Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="client-name-cell">
                      <div className="client-avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.role === "admin" ? "confirmed" : user.role === "reception" ? "pending" : "completed"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="reception">Reception</option>
                      <option value="staff">Staff</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="panel premium-panel">
        <div className="panel-header">
          <h3>Available Roles</h3>
          <span className="panel-badge info-badge">3</span>
        </div>

        <ul>
          <li className="notification-item">Admin: full access to the entire system.</li>
          <li className="notification-item">Reception: clients and appointments access.</li>
          <li className="notification-item">Staff: appointments-focused access only.</li>
        </ul>
      </div>
    </div>
  );
}

export default Users;