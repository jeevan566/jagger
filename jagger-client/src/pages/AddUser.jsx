import { useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AddUser() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "manager",
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);
      setMsg("User created successfully!");
      setTimeout(() => navigate("/users"), 1200);
    } catch (err) {
      const message = err?.response?.data?.message || "Error creating user";
      setMsg(message);
    }
  };

  // if (!user || user.role !== "admin") {
  //   return <h3>Only admin can create users.</h3>;
  // }

  // return (
  //   <div className="card shadow p-4" style={{ maxWidth: 500 }}>
  //     <h3 className="mb-4">Create User</h3>

  //     {msg && <div className="alert alert-info">{msg}</div>}

  //     <form onSubmit={handleSubmit}>
  //       <input
  //         type="text"
  //         name="name"
  //         className="form-control mb-3"
  //         placeholder="Full Name"
  //         value={form.name}
  //         onChange={handleChange}
  //         required
  //       />

  //       <input
  //         type="email"
  //         name="email"
  //         className="form-control mb-3"
  //         placeholder="Email Address"
  //         value={form.email}
  //         onChange={handleChange}
  //         required
  //       />

  //       <input
  //         type="password"
  //         name="password"
  //         className="form-control mb-3"
  //         placeholder="Password"
  //         value={form.password}
  //         onChange={handleChange}
  //         required
  //       />

  //       <select
  //         name="role"
  //         className="form-select mb-3"
  //         value={form.role}
  //         onChange={handleChange}
  //       >
  //         <option value="manager">Manager</option>
  //         <option value="supplier">Supplier</option>
  //         {/* <option value="admin">Admin</option> */}
  //       </select>

  //       <button className="btn btn-primary w-100">Create User</button>
  //     </form>
  //   </div>
  // );
if (!user || user.role !== "admin") {
  return (
    <div className="page-wrapper">
      <h3 className="page-title">Create User</h3>
      <div className="alert alert-warning">
        Only admin can create users.
      </div>
    </div>
  );
}

return (
  <div className="page-wrapper">
    <h3 className="page-title">Create User</h3>

    <div
      className="settings-card"
      style={{ maxWidth: "600px", margin: "0 auto" }}
    >
      {msg && <div className="alert alert-info">{msg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Name */}
          <div className="col-md-12">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="col-md-12">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="col-md-12">
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

          {/* Role */}
          <div className="col-md-12">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-control"
              value={form.role}
              onChange={handleChange}
            >
              <option value="manager">Manager</option>
              <option value="supplier">Supplier</option>
              {/* Admin creation intentionally disabled */}
            </select>
          </div>
        </div>

        <div className="text-end mt-4">
          <button className="btn btn-primary px-4">
            Create User
          </button>
        </div>
      </form>
    </div>
  </div>
);

}
