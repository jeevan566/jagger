
// import { Outlet, NavLink } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import Notifications from "../components/Notifications";

// export default function MainLayout() {
//   const { user, logout } = useContext(AuthContext);

//   const linkClass = ({ isActive }) =>
//     "nav-link text-white " + (isActive ? "bg-primary rounded" : "");

//   return (
//     <div className="layout-root">
//       {/* ===== SIDEBAR ===== */}
//       <aside className="sidebar">
//         <h4 className="mb-4">E-Procurement</h4>

//         <ul className="nav flex-column">
//           <li className="nav-item mb-2">
//             <NavLink to="/dashboard" className={linkClass}>
//               Dashboard
//             </NavLink>
//           </li>

//           {user?.role === "admin" && (
//             <>
//               {/* <NavLink to="/register" className={linkClass}>Create User</NavLink> */}
//               <NavLink to="/settings" className={linkClass}>Admin Settings</NavLink>
//               <NavLink to="/users" className={linkClass}>Users</NavLink>
//               <NavLink to="/add-user" className={linkClass}>Add User</NavLink>
//               <NavLink to="/inventory" className={linkClass}>Inventory</NavLink>
//               <NavLink to="/suppliers" className={linkClass}>Suppliers</NavLink>
//               <NavLink to="/categories" className={linkClass}>Categories</NavLink>
//               <NavLink to="/products" className={linkClass}>Products</NavLink>
//               <NavLink to="/rfqs" className={linkClass}>RFQs</NavLink>
//               <NavLink to="/pos" className={linkClass}>POs</NavLink>
//               <NavLink to="/audit" className={linkClass}>Audit Logs</NavLink>
//             </>
//           )}

//           {user?.role === "manager" && (
//             <>
//               <NavLink to="/rfqs" className={linkClass}>RFQs</NavLink>
//               <NavLink to="/pos" className={linkClass}>PO Approval</NavLink>
//               <NavLink to="/inventory" className={linkClass}>Inventory</NavLink>
//               <NavLink to="/products" className={linkClass}>Products</NavLink>
//               <NavLink to="/audit" className={linkClass}>Audit Logs</NavLink>
//             </>
//           )}

//           {user?.role === "supplier" && (
//             <NavLink to="/supplier-rfqs" className={linkClass}>
//               RFQs Assigned
//             </NavLink>
//           )}
//         </ul>
//       </aside>

//       {/* ===== MAIN CONTENT ===== */}
//       <div className="main-area">
//         {/* TOP NAVBAR */}
//         <nav className="topbar">
//           <span>Welcome, {user?.name}</span>

//           <div className="d-flex gap-3 align-items-center">
//             <Notifications />
//             <button className="btn btn-outline-danger btn-sm" onClick={logout}>
//               Logout
//             </button>
//           </div>
//         </nav>

//         {/* PAGE CONTENT */}
//         <div className="content-area">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }
import { Outlet, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Notifications from "../components/Notifications";

export default function MainLayout() {
  const { user, logout } = useContext(AuthContext);

  const linkClass = ({ isActive }) =>
    "sidebar-link " + (isActive ? "active" : "");

  return (
    <div className="layout-root d-flex">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <h4 className="sidebar-title">E-Procurement</h4>

        <NavLink to="/dashboard" className={linkClass}>
          <i className="bi bi-speedometer2"></i>
          Dashboard
        </NavLink>

        {user?.role === "admin" && (
          <>
            <NavLink to="/settings" className={linkClass}>
              <i className="bi bi-gear"></i>
              Admin Settings
            </NavLink>

            <NavLink to="/users" className={linkClass}>
              <i className="bi bi-people"></i>
              Users
            </NavLink>

            <NavLink to="/add-user" className={linkClass}>
              <i className="bi bi-person-plus"></i>
              Add User
            </NavLink>

            <NavLink to="/inventory" className={linkClass}>
              <i className="bi bi-box-seam"></i>
              Inventory
            </NavLink>

            <NavLink to="/suppliers" className={linkClass}>
              <i className="bi bi-truck"></i>
              Suppliers
            </NavLink>

            <NavLink to="/categories" className={linkClass}>
              <i className="bi bi-tags"></i>
              Categories
            </NavLink>

            <NavLink to="/products" className={linkClass}>
              <i className="bi bi-bag-check"></i>
              Products
            </NavLink>

            <NavLink to="/rfqs" className={linkClass}>
              <i className="bi bi-file-earmark-text"></i>
              RFQs
            </NavLink>

            <NavLink to="/pos" className={linkClass}>
              <i className="bi bi-receipt"></i>
              POs
            </NavLink>

            <NavLink to="/audit" className={linkClass}>
              <i className="bi bi-shield-check"></i>
              Audit Logs
            </NavLink>
          </>
        )}

        {user?.role === "manager" && (
          <>
            <NavLink to="/rfqs" className={linkClass}>
              <i className="bi bi-file-earmark-text"></i>
              RFQs
            </NavLink>

            <NavLink to="/pos" className={linkClass}>
              <i className="bi bi-check2-circle"></i>
              PO Approval
            </NavLink>

            <NavLink to="/inventory" className={linkClass}>
              <i className="bi bi-box-seam"></i>
              Inventory
            </NavLink>

            <NavLink to="/products" className={linkClass}>
              <i className="bi bi-bag-check"></i>
              Products
            </NavLink>

            <NavLink to="/audit" className={linkClass}>
              <i className="bi bi-shield-check"></i>
              Audit Logs
            </NavLink>
          </>
        )}

        {user?.role === "supplier" && (
          <NavLink to="/supplier-rfqs" className={linkClass}>
            <i className="bi bi-inbox"></i>
            RFQs Assigned
          </NavLink>
        )}
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="main-area flex-grow-1">
        {/* TOP BAR */}
        <nav className="topbar">
          <span className="fw-semibold">
            Welcome, {user?.name}
          </span>

          <div className="d-flex align-items-center gap-3">
            <Notifications />
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </nav>

        {/* CONTENT */}
        <div className="content-area p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
