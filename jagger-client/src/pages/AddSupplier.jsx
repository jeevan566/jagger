import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AddSupplier() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addSupplier = async (e) => {
    e.preventDefault();
    await api.post("/suppliers", form);
    navigate("/suppliers");
  };

  return (
    <div className="card p-4 shadow" style={{ maxWidth: 500 }}>
      <h3 className="mb-3">Add Supplier</h3>

      <form onSubmit={addSupplier}>
        <input
          type="text"
          className="form-control mb-3"
          name="name"
          placeholder="Contact Person Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          className="form-control mb-3"
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          className="form-control mb-3"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          className="form-control mb-3"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <textarea
          className="form-control mb-3"
          name="address"
          placeholder="Address"
          rows="3"
          value={form.address}
          onChange={handleChange}
        />

        <button className="btn btn-primary w-100">Save Supplier</button>
      </form>
    </div>
  );
}
