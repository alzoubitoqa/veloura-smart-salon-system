import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1>Veloura Management Dashboard</h1>
        <p>
          Welcome back{user ? `, ${user.name}` : ""}{" "}
          {user ? `• ${user.role}` : ""}
        </p>
      </div>

      <div className="navbar-right">
        <div className="user-badge">
          {user?.name ? user.name.charAt(0).toUpperCase() : "V"}
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;