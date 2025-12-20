import { useEffect, useState } from "react";
import api from "../api/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      const res = await api.get("/categories");
      setCategories(res.data);
    };
    loadCategories();
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    await api.post("/categories", { name });
    setName("");

    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete category?")) return;

    await api.delete(`/categories/${id}`);

    const res = await api.get("/categories");
    setCategories(res.data);
  };

  return (
    <div>
      <h3>Categories</h3>

      <form className="d-flex mb-3" onSubmit={addCategory}>
        <input
          type="text"
          className="form-control me-2"
          placeholder="New category"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary">Add</button>
      </form>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr><th>Category</th><th width="150">Actions</th></tr>
        </thead>

        <tbody>
          {categories.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteCategory(c._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
