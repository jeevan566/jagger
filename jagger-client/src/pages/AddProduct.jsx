import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    unit: "pcs",
    basePrice: 0,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    const loadCategories = async () => {
      const res = await api.get("/categories");
      setCategories(res.data);
    };
    loadCategories();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    await api.post("/products", form);
    navigate("/products");
  };

  // return (
  //   <div className="card p-4 shadow" style={{ maxWidth: 600 }}>
  //     <h3>Add Product</h3>

  //     <form onSubmit={addProduct}>
  //       <input
  //         className="form-control mb-3"
  //         name="name"
  //         placeholder="Product name"
  //         value={form.name}
  //         onChange={handleChange}
  //         required
  //       />

  //       <textarea
  //         className="form-control mb-3"
  //         name="description"
  //         placeholder="Description"
  //         onChange={handleChange}
  //       />

  //       <select
  //         name="categoryId"
  //         className="form-select mb-3"
  //         value={form.categoryId}
  //         onChange={handleChange}
  //         required
  //       >
  //         <option value="">Select category</option>
  //         {categories.map((c) => (
  //           <option key={c._id} value={c._id}>
  //             {c.name}
  //           </option>
  //         ))}
  //       </select>

  //       <input
  //         className="form-control mb-3"
  //         name="unit"
  //         placeholder="Unit (e.g. pcs)"
  //         value={form.unit}
  //         onChange={handleChange}
  //       />

  //       <input
  //         className="form-control mb-3"
  //         name="basePrice"
  //         type="number"
  //         placeholder="Base price"
  //         value={form.basePrice}
  //         onChange={handleChange}
  //       />

  //       <button className="btn btn-primary w-100">Save Product</button>
  //     </form>
  //   </div>
  // );
  return (
    <div className="page-wrapper">
      <h3 className="page-title">Add Product</h3>

      <div
        className="settings-card"
        style={{ maxWidth: "700px", margin: "0 auto" }}
      >
        <form onSubmit={addProduct}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Product Name</label>
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Category</label>
              <select
                name="categoryId"
                className="form-control"
                value={form.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Unit</label>
              <input
                className="form-control"
                name="unit"
                value={form.unit}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Base Price</label>
              <input
                className="form-control"
                type="number"
                name="basePrice"
                value={form.basePrice}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="text-end mt-4">
            <button className="btn btn-primary px-4">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}
