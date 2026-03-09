import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Appointments from "./pages/Appointments";
import Staff from "./pages/Staff";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Users from "./pages/Users";

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/clients"
            element={
              <RoleProtectedRoute allowedRoles={["admin", "reception"]}>
                <Clients />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/appointments"
            element={
              <RoleProtectedRoute allowedRoles={["admin", "reception", "staff"]}>
                <Appointments />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/staff"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <Staff />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <Inventory />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <Reports />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <Users />
              </RoleProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to={location.pathname.startsWith("/login") ? "/login" : "/"}
          />
        }
      />
    </Routes>
  );
}

export default App;