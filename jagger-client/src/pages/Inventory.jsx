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
  }, [user?.role]); // ✅ correct dependency

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

  // return (
  //   <div>
  //     <h3>Inventory Management</h3>

  //     {/* ADMIN ADD INVENTORY */}
  //     {user?.role === "admin" && (
  //       <div className="card p-3 mt-3">
  //         <h5>Add Inventory</h5>

  //         <select
  //           className="form-control"
  //           value={productId}
  //           onChange={(e) => setProductId(e.target.value)}
  //         >
  //           <option value="">Select Product</option>
  //           {products.map((p) => (
  //             <option key={p._id} value={p._id}>
  //               {p.name}
  //             </option>
  //           ))}
  //         </select>

  //         <input
  //           className="form-control mt-2"
  //           placeholder="Quantity"
  //           type="number"
  //           value={quantity}
  //           onChange={(e) => setQuantity(e.target.value)}
  //         />

  //         <input
  //           className="form-control mt-2"
  //           placeholder="Minimum Stock"
  //           type="number"
  //           value={minStock}
  //           onChange={(e) => setMinStock(e.target.value)}
  //         />

  //         <button className="btn btn-primary mt-2" onClick={addInventory}>
  //           Add Inventory
  //         </button>
  //       </div>
  //     )}

  //     {/* INVENTORY TABLE */}
  //     <table className="table table-bordered mt-4">
  //       <thead className="table-dark">
  //         <tr>
  //           <th>Product</th>
  //           <th>Quantity</th>
  //           <th>Min Stock</th>
  //           <th>Status</th>
  //         </tr>
  //       </thead>

  //       <tbody>
  //         {items.map((i) => (
  //           <tr key={i._id}>
  //             <td>{i.productId.name}</td>
  //             <td>{i.quantity}</td>
  //             <td>{i.minStock}</td>
  //             <td>
  //               {i.quantity === 0 && (
  //                 <span className="badge bg-danger">Out</span>
  //               )}
  //               {i.quantity > 0 && i.quantity <= i.minStock && (
  //                 <span className="badge bg-warning">Low</span>
  //               )}
  //               {i.quantity > i.minStock && (
  //                 <span className="badge bg-success">In Stock</span>
  //               )}
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );
  return (
    <div className="page-wrapper">
      <h3 className="page-title">Inventory Management</h3>

      {/* ADMIN ADD INVENTORY */}
      {user?.role === "admin" && (
        <div className="settings-card mb-4">
          <h5 className="mb-3 fw-semibold">Add Inventory</h5>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Product</label>
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
            </div>

            <div className="col-md-4">
              <label className="form-label">Quantity</label>
              <input
                className="form-control"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Minimum Stock</label>
              <input
                className="form-control"
                type="number"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
              />
            </div>
          </div>

          <div className="text-end mt-4">
            <button className="btn btn-primary px-4" onClick={addInventory}>
              Add Inventory
            </button>
          </div>
        </div>
      )}

      {/* INVENTORY TABLE */}
      <div className="settings-card">
        <h5 className="mb-3 fw-semibold">Current Inventory</h5>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Min Stock</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    No inventory records found
                  </td>
                </tr>
              ) : (
                items.map((i) => (
                  <tr key={i._id}>
                    <td>{i.productId.name || "null"}</td>
                    <td>{i.quantity}</td>
                    <td>{i.minStock}</td>
                    <td>
                      {i.quantity === 0 && (
                        <span className="badge bg-danger">Out of Stock</span>
                      )}
                      {i.quantity > 0 && i.quantity <= i.minStock && (
                        <span className="badge bg-warning text-dark">
                          Low Stock
                        </span>
                      )}
                      {i.quantity > i.minStock && (
                        <span className="badge bg-success">In Stock</span>
                      )}
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
