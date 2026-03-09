import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Pearls Salon Login</h2>
        <p>Sign in to access the smart management system.</p>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          {errorMessage && <p className="error-text">{errorMessage}</p>}

          <button type="submit" className="primary-btn login-btn">
            Login
          </button>
        </form>

        <div className="login-demo">
          <p><strong>Demo Accounts:</strong></p>
          <p>admin@pearls.com / 123456</p>
          <p>reception@pearls.com / 123456</p>
          <p>staff@pearls.com / 123456</p>
        </div>
      </div>
    </div>
  );
}

export default Login;