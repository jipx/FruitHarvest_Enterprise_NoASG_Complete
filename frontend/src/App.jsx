import { useState } from "react";
import { Apple, LayoutDashboard, ShieldCheck, ShoppingCart } from "lucide-react";
import CustomerPortal from "./pages/CustomerPortal";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { getUserRole, setUserRole } from "./auth/roleGuard";

export default function App() {
  const [role, setRole] = useState(getUserRole());

  function changeRole(newRole) {
    setUserRole(newRole);
    setRole(newRole);
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-icon">
              <Apple size={24} />
            </div>

            <div>
              <div className="brand-title">FruitHarvest Enterprise</div>
              <div className="brand-subtitle">
                Customer ordering, staff operations, and admin control
              </div>
            </div>
          </div>

          <nav className="role-switcher">
            <button
              className={`role-button ${role === "customer" ? "active" : ""}`}
              onClick={() => changeRole("customer")}
            >
              <ShoppingCart size={16} /> Customer
            </button>

            <button
              className={`role-button ${role === "staff" ? "active" : ""}`}
              onClick={() => changeRole("staff")}
            >
              <LayoutDashboard size={16} /> Staff
            </button>

            <button
              className={`role-button ${role === "admin" ? "active" : ""}`}
              onClick={() => changeRole("admin")}
            >
              <ShieldCheck size={16} /> Admin
            </button>
          </nav>
        </div>
      </header>

      {role === "customer" && <CustomerPortal />}
      {role === "staff" && <StaffDashboard />}
      {role === "admin" && <AdminDashboard />}
    </div>
  );
}
