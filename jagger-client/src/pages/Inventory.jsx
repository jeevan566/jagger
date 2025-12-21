import { useEffect, useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Inventory() {
  const { user } = useContext(AuthContext);

  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minStock, setMinStock] = useState("");

  useEffect(() => {
    const loadInventory = async () => {
      const res = await api.get("/inventory");
      setItems(res.data);

      if (user?.role === "admin") {
        const p = await api.get("/products");
        setProducts(p.data);
      }
    };

    loadInventory();
  }, [user?.role]);

  const refreshInventory = async () => {
    const res = await api.get("/inventory");
    setItems(res.data);
  };

  const addInventory = async () => {
    await api.post("/inventory", {
      productId,
      quantity,
      minStock,
    });

    alert("Inventory added");

    setProductId("");
    setQuantity("");
    setMinStock("");

    refreshInventory();
  };

  return (
    <div>
      <h3>Inventory Management</h3>

      {/* ADMIN ADD INVENTORY */}
      {user?.role === "admin" && (
        <div className="card p-3 mt-3">
          <h5>Add Inventory</h5>

          <select
            className="form-control"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            className="form-control mt-2"
            placeholder="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <input
            className="form-control mt-2"
            placeholder="Minimum Stock"
            type="number"
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
          />

          <button className="btn btn-primary mt-2" onClick={addInventory}>
            Add Inventory
          </button>
        </div>
      )}

      {/* INVENTORY TABLE */}
      <table className="table table-bordered mt-4">
        <thead className="table-dark">
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Min Stock</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>
                {item.productId?.name || "Deleted Product"}
              </td>

              <td>{item.quantity}</td>
              <td>{item.minStock}</td>

              <td>
                {item.quantity <= item.minStock ? (
                  <span className="badge bg-danger">Low</span>
                ) : (
                  <span className="badge bg-success">OK</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
