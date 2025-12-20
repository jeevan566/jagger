// import { Outlet, Link } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import Notifications from "../components/Notifications"; // <-- IMPORTANT

// export default function MainLayout() {
//   const { user, logout } = useContext(AuthContext);

//   return (
//     <div className="d-flex">
//       {/* Sidebar */}
//       <div
//         className="bg-dark text-white p-3"
//         style={{ width: "250px", height: "100vh", position: "fixed" }}
//       >
//         <h4 className="mb-4">Jagger Clone</h4>

//         <ul className="nav flex-column">
//           {/* COMMON */}
//           <li className="nav-item mb-2">
//             <Link className="nav-link text-white" to="/dashboard">
//               Dashboard
//             </Link>
//           </li>

//           {/* ====================== */}
//           {/* ADMIN MENU */}
//           {/* ====================== */}
//           {user?.role === "admin" && (
//             <>
//               <li className="nav-item mb-2">
//                 <Link className="nav-link text-white" to="/register">
//                   Create User
//                 </Link>
//               </li>
//               <li className="nav-item mb-2">
//                 <Link className="nav-link text-white" to="/settings">
//                   Admin Settings
//                 </Link>
//               </li>

//               <li className="nav-item mb-2">
//                 <Link className="nav-link text-white" to="/users">
//                   Users
//                 </Link>
//               </li>

//               <li className="nav-item mb-2">
//                 <Link className="nav-link text-white" to="/add-user">
//                   Add User
//                 </Link>
//               </li>
//               <li className="nav-item mb-2">
//                 <Link className="nav-link text-white" to="/inventory">
//                   Inventory
//                 </Link>
//               </li>

//               <li className="nav-item mb-2">
//                 <Link className="nav-link text-white" to="/suppliers">
//                   Suppliers
//                 </Link>
//               </li>

//               <li className="nav-item mb-2">
//                 <Link className="nav-link text-white" to="/categories">
//                   Categories
//                 </Link>
//               </li>

//               <li className="nav-item mb-2">
//                 <Link className="nav-link text-white" to="/products">
//                   Products
//                 </Link>
//               </li>

//               <li className="nav-item mb-2">
//                 <Link className="nav-link text-white" to="/rfqs">
//                   RFQs
//                 </Link>
//               </li>

//               <li className="nav-item mb-2">
//                 <Link className="nav-link text-white" to="/pos">
//                   POs
//                 </Link>
//               </li>

//               <li className="nav-item mb-2">
//                 <Link className="nav-link text-white" to="/audit">
//                   Audit Logs
//                 </Link>
//               </li>
//             </>
//           )}

//           {/* ====================== */}
//           {/* MANAGER MENU */}
//           {/* ====================== */}
//           {user?.role === "manager" && (
//             <>
//               <li className="nav-item mb-2">
//                 <Link className="nav-link text-white" to="/rfqs">
//                   RFQs List
//                 </Link>
//               </li>

//               <li className="nav-item mb-2">
//                 <Link className="nav-link text-white" to="/pos">
//                   PO Approval
//                 </Link>
//               </li>

//               <li className="nav-item mb-2">
//                 <Link className="nav-link text-white" to="/suppliers">
//                   Suppliers
//                 </Link>
//               </li>
//               <li className="nav-item mb-2">
//                 <Link className="nav-link text-white" to="/inventory">
//                   Inventory
//                 </Link>
//               </li>

//               <li className="nav-item mb-2">
//                 <Link className="nav-link text-white" to="/products">
//                   Products
//                 </Link>
//               </li>

//               <li className="nav-item mb-2">
//                 <Link className="nav-link text-white" to="/audit">
//                   Audit Logs
//                 </Link>
//               </li>
//             </>
//           )}

//           {/* ====================== */}
//           {/* SUPPLIER MENU */}
//           {/* ====================== */}
//           {user?.role === "supplier" && (
//             <li className="nav-item mb-2">
//               <Link className="nav-link text-white" to="/supplier-rfqs">
//                 RFQs Assigned
//               </Link>
//             </li>
//           )}
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div style={{ marginLeft: "250px", width: "100%" }}>
//         {/* TOP NAVBAR */}
//         <nav className="navbar navbar-light bg-light px-3 shadow-sm d-flex justify-content-between">
//           <span className="navbar-brand mb-0 h5">Welcome, {user?.name}</span>

//           <div className="d-flex align-items-center gap-3">
//             {/* 🔔 Notification Bell */}
//             <Notifications />

//             {/* Logout Button */}
//             <button className="btn btn-outline-danger btn-sm" onClick={logout}>
//               Logout
//             </button>
//           </div>
//         </nav>

//         <div className="container mt-4">
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
    "nav-link text-white " + (isActive ? "bg-primary rounded" : "");

  return (
    <div className="layout-root">
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <h4 className="mb-4">Jagger Clone</h4>

        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          </li>

          {user?.role === "admin" && (
            <>
              <NavLink to="/register" className={linkClass}>Create User</NavLink>
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
