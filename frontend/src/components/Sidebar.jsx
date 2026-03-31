import { NavLink } from "react-router-dom";

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">V</div>
        <div>
          <h2>Veloura Salon</h2>
          <p>Smart Management</p>
        </div>
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          Dashboard
        </NavLink>

        {(role === "admin" || role === "reception") && (
          <NavLink
            to="/clients"
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            Clients
          </NavLink>
        )}

        {(role === "admin" || role === "reception" || role === "staff") && (
          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            Appointments
          </NavLink>
        )}

        {role === "admin" && (
          <NavLink
            to="/staff"
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            Staff
          </NavLink>
        )}

        {role === "admin" && (
          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            Inventory
          </NavLink>
        )}

        {role === "admin" && (
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            Reports
          </NavLink>
        )}

        {role === "admin" && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            Users
          </NavLink>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;