import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CreateRFQ() {
  const [suppliers, setSuppliers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({ title: "", notes: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const loadSuppliers = async () => {
      const res = await api.get("/users/role/supplier");
      // const res = await api.get("/suppliers");
      setSuppliers(res.data);
    };
    loadSuppliers();
  }, []);

  const toggleSupplier = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const createRFQ = async (e) => {
    e.preventDefault();
    const res = await api.post("/rfqs", {
      ...form,
      suppliers: selected,
    });
    navigate(`/rfq/${res.data._id}`);
  };

  return (
    <div className="card p-4 shadow">
      <h3>Create RFQ</h3>

      <form onSubmit={createRFQ}>
        <input
          className="form-control mb-3"
          placeholder="RFQ Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          className="form-control mb-3"
          placeholder="Notes"
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <h5>Select Suppliers</h5>
        {suppliers.map((s) => (
          <div key={s._id} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              onChange={() => toggleSupplier(s._id)}
            />
            <label className="form-check-label">
              {s.name} ({s.email})
            </label>
          </div>
        ))}

        <button className="btn btn-primary mt-3">Create RFQ</button>
      </form>
    </div>
  );
}
