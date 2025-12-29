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

  // return (
  //   <div className="card p-4 shadow">
  //     <h3>Create RFQ</h3>

  //     <form onSubmit={createRFQ}>
  //       <input
  //         className="form-control mb-3"
  //         placeholder="RFQ Title"
  //         onChange={(e) => setForm({ ...form, title: e.target.value })}
  //         required
  //       />

  //       <textarea
  //         className="form-control mb-3"
  //         placeholder="Notes"
  //         onChange={(e) => setForm({ ...form, notes: e.target.value })}
  //       />

  //       <h5>Select Suppliers</h5>
  //       {suppliers.map((s) => (
  //         <div key={s._id} className="form-check">
  //           <input
  //             type="checkbox"
  //             className="form-check-input"
  //             onChange={() => toggleSupplier(s._id)}
  //           />
  //           <label className="form-check-label">
  //             {s.name} ({s.email})
  //           </label>
  //         </div>
  //       ))}

  //       <button className="btn btn-primary mt-3">Create RFQ</button>
  //     </form>
  //   </div>
  // );
  return (
    <div className="page-wrapper">
      <h3 className="page-title">Create RFQ</h3>

      <div
        className="settings-card"
        style={{ maxWidth: "800px", margin: "0 auto" }}
      >
        <form onSubmit={createRFQ}>
          {/* Title */}
          <div className="mb-3">
            <label className="form-label">RFQ Title</label>
            <input
              className="form-control"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          {/* Notes */}
          <div className="mb-3">
            <label className="form-label">Notes</label>
            <textarea
              className="form-control"
              rows="3"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          {/* Suppliers */}
          <div className="mb-3">
            <label className="form-label">Select Suppliers</label>

            <div
              className="border rounded p-3"
              style={{ maxHeight: "250px", overflowY: "auto" }}
            >
              {suppliers.map((s) => (
                <div key={s._id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selected.includes(s._id)}
                    onChange={() => toggleSupplier(s._id)}
                  />
                  <label className="form-check-label">
                    {s.name} ({s.email})
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="text-end mt-4">
            <button className="btn btn-primary px-4">Create RFQ</button>
          </div>
        </form>
      </div>
    </div>
  );
}
