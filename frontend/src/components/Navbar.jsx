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
      <div>
        <h1>Smart Salon Dashboard</h1>
        <p>
          Welcome back{user ? `, ${user.name}` : ""}{" "}
          {user ? `(${user.role})` : ""}
        </p>
      </div>

      <div className="navbar-right">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Navbar;