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

  // return (
  //   <div>
  //     <h3>Categories</h3>

  //     <form className="d-flex mb-3" onSubmit={addCategory}>
  //       <input
  //         type="text"
  //         className="form-control me-2"
  //         placeholder="New category"
  //         value={name}
  //         onChange={(e) => setName(e.target.value)}
  //       />
  //       <button className="btn btn-primary">Add</button>
  //     </form>

  //     <table className="table table-bordered">
  //       <thead className="table-dark">
  //         <tr><th>Category</th><th width="150">Actions</th></tr>
  //       </thead>

  //       <tbody>
  //         {categories.map((c) => (
  //           <tr key={c._id}>
  //             <td>{c.name}</td>
  //             <td>
  //               <button
  //                 className="btn btn-danger btn-sm"
  //                 onClick={() => deleteCategory(c._id)}
  //               >
  //                 Delete
  //               </button>
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );
  return (
    <div className="page-wrapper">
      <h3 className="page-title">Categories</h3>

      {/* Add Category */}
      <div className="settings-card mb-4" style={{ maxWidth: "600px" }}>
        <form onSubmit={addCategory}>
          <label className="form-label">New Category</label>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
            />
            <button className="btn btn-primary px-4">Add</button>
          </div>
        </form>
      </div>

      {/* Categories Table */}
      <div className="settings-card">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Category</th>
                <th style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center text-muted py-4">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteCategory(c._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
