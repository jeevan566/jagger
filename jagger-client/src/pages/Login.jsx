import { useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials" + err);
    }
  };

  // return (
  //   <div
  //     className="d-flex justify-content-center align-items-center vh-100"
  //     style={{ background: "#f4f6f8" }}
  //   >
  //     <div className="card p-4 shadow" style={{ width: "380px" }}>
  //       <h3 className="text-center mb-1">E-Procurement System</h3>
  //       <p className="text-center text-muted mb-4" style={{ fontSize: "14px" }}>
  //         Strategic Sourcing & Procurement Platform
  //       </p>

  //       <form onSubmit={handleSubmit}>
  //         <input
  //           type="email"
  //           name="email"
  //           className="form-control mb-3"
  //           placeholder="Email"
  //           value={form.email}
  //           onChange={handleChange}
  //           required
  //         />

  //         <input
  //           type="password"
  //           name="password"
  //           className="form-control mb-3"
  //           placeholder="Password"
  //           value={form.password}
  //           onChange={handleChange}
  //           required
  //         />

  //         <button className="btn btn-primary w-100 mb-3">
  //           Login
  //         </button>
  //       </form>

  //       {/* 🔐 Info Section */}
  //       <div className="text-center">
  //         <p className="text-muted mb-2" style={{ fontSize: "13px" }}>
  //           Access to this system is managed by administrators.
  //         </p>

  //         {/* Admin Create User */}
  //         <Link
  //           to="/register"
  //           className="text-decoration-none"
  //           style={{ fontSize: "14px" }}
  //         >
  //           ➕ Create User (Admin Only)
  //         </Link>
  //       </div>

  //       <hr />

  //       {/* About JAGGAER */}
  //       <div className="text-muted" style={{ fontSize: "12px" }}>
  //         <p className="mb-1">
  //           <strong>About E-Procurement</strong>
  //         </p>
  //         <p className="mb-0">
  //           E-Procurement is a leading procurement and sourcing platform that enables
  //           organizations to manage suppliers, RFQs, purchase orders, and
  //           inventory through a centralized digital workflow.
  //         </p>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="login-wrapper">
      {/* LEFT BRAND PANEL */}
      <div className="login-left">
        <h1>E-Procurement</h1>
        <p className="tagline">
          Strategic Sourcing & Digital Procurement Platform
        </p>

        <ul className="feature-list">
          <li>✔ Supplier Management</li>
          <li>✔ RFQ & Quote Comparison</li>
          <li>✔ Purchase Order Automation</li>
          <li>✔ Inventory & Audit Tracking</li>
        </ul>

        <div className="footer-text">
          Academic Project • Enterprise Procurement System
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="login-right">
        <div className="login-card">
          <h3 className="text-center mb-1">Welcome Back</h3>
          <p className="text-center text-muted mb-4">
            Login to continue to E-Procurement
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-primary w-100 mb-3">Login</button>
          </form>

          <div className="text-center">
            <p className="text-muted small mb-2">
              Access managed by administrators
            </p>

            <Link to="/register" className="register-link">
              ➕ Create User (Admin Only)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
