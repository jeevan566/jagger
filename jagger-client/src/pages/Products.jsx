import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const res = await api.get("/products");
      setProducts(res.data);
    };
    loadProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!confirm("Delete product?")) return;

    await api.delete(`/products/${id}`);

    // refresh
    const res = await api.get("/products");
    setProducts(res.data);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Products</h3>
        <Link to="/add-product" className="btn btn-primary">Add Product</Link>
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Unit</th>
            <th>Base Price</th>
            <th width="150">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p?.categoryId?.name}</td>
              <td>{p.unit}</td>
              <td>{p.basePrice}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteProduct(p._id)}
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
