import { Outlet, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Notifications from "../components/Notifications";

export default function MainLayout() {
  const { user, logout } = useContext(AuthContext);

  const linkClass = ({ isActive }) =>
    "nav-link text-white " + (isActive ? "bg-primary rounded" : "");

  return (
    <div className="layout-root">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <h4 className="mb-4">E-Procurement</h4>

        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          </li>

          {user?.role === "admin" && (
            <>
              {/* <NavLink to="/register" className={linkClass}>Create User</NavLink> */}
              <NavLink to="/settings" className={linkClass}>Admin Settings</NavLink>
              <NavLink to="/users" className={linkClass}>Users</NavLink>
              <NavLink to="/add-user" className={linkClass}>Add User</NavLink>
              <NavLink to="/inventory" className={linkClass}>Inventory</NavLink>
              <NavLink to="/suppliers" className={linkClass}>Suppliers</NavLink>
              <NavLink to="/categories" className={linkClass}>Categories</NavLink>
              <NavLink to="/products" className={linkClass}>Products</NavLink>
              <NavLink to="/rfqs" className={linkClass}>RFQs</NavLink>
              <NavLink to="/pos" className={linkClass}>POs</NavLink>
              <NavLink to="/audit" className={linkClass}>Audit Logs</NavLink>
            </>
          )}

          {user?.role === "manager" && (
            <>
              <NavLink to="/rfqs" className={linkClass}>RFQs</NavLink>
              <NavLink to="/pos" className={linkClass}>PO Approval</NavLink>
              <NavLink to="/inventory" className={linkClass}>Inventory</NavLink>
              <NavLink to="/products" className={linkClass}>Products</NavLink>
              <NavLink to="/audit" className={linkClass}>Audit Logs</NavLink>
            </>
          )}

          {user?.role === "supplier" && (
            <NavLink to="/supplier-rfqs" className={linkClass}>
              RFQs Assigned
            </NavLink>
          )}
        </ul>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="main-area">
        {/* TOP NAVBAR */}
        <nav className="topbar">
          <span>Welcome, {user?.name}</span>

          <div className="d-flex gap-3 align-items-center">
            <Notifications />
            <button className="btn btn-outline-danger btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
