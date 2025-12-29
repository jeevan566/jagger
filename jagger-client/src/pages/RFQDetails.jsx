import { useEffect, useState } from "react";
import api from "../api/api";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function RFQDetails() {
  const { id } = useParams();
  const [rfq, setRfq] = useState(null);
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [newItem, setNewItem] = useState({
    productId: "",
    quantity: 0,
    unit: "pcs",
  });

  useEffect(() => {
    const loadData = async () => {
      const details = await api.get(`/rfqs/${id}`);
      setRfq(details.data.rfq);
      setItems(details.data.items);

      const prods = await api.get("/products");
      setProducts(prods.data);
    };

    loadData();
  }, [id]);

  const addItem = async (e) => {
    e.preventDefault();
    await api.post(`/rfqs/${id}/add-item`, newItem);
    setNewItem({ productId: "", quantity: 0, unit: "pcs" });

    const details = await api.get(`/rfqs/${id}`);
    setRfq(details.data.rfq);
    setItems(details.data.items);
  };

  const publishRFQ = async () => {
    await api.put(`/rfqs/${id}/publish`);

    const details = await api.get(`/rfqs/${id}`);
    setRfq(details.data.rfq);
    setItems(details.data.items);
  };

  if (!rfq) return <div>Loading...</div>;

  // return (
  //   <div>
  //     <h3>
  //       {rfq.title} ({rfq.rfqNumber})
  //     </h3>
  //     <p>Status: {rfq.status}</p>

  //     <h5>Suppliers</h5>
  //     <ul>
  //       {rfq.suppliers.map((s) => (
  //         <li key={s._id}>
  //           {s.name} ({s.email})
  //         </li>
  //       ))}
  //     </ul>

  //     <hr />

  //     <h5>Add Items</h5>
  //     <form className="row" onSubmit={addItem}>
  //       <div className="col-md-4">
  //         <select
  //           className="form-select"
  //           value={newItem.productId}
  //           onChange={(e) =>
  //             setNewItem({ ...newItem, productId: e.target.value })
  //           }
  //           required
  //         >
  //           <option value="">Select Product</option>
  //           {products.map((p) => (
  //             <option key={p._id} value={p._id}>
  //               {p.name}
  //             </option>
  //           ))}
  //         </select>
  //       </div>

  //       <div className="col-md-3">
  //         <input
  //           type="number"
  //           className="form-control"
  //           placeholder="Quantity"
  //           value={newItem.quantity}
  //           onChange={(e) =>
  //             setNewItem({ ...newItem, quantity: e.target.value })
  //           }
  //           required
  //         />
  //       </div>

  //       <div className="col-md-3">
  //         <input
  //           className="form-control"
  //           placeholder="Unit"
  //           value={newItem.unit}
  //           onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
  //         />
  //       </div>

  //       <div className="col-md-2">
  //         <button className="btn btn-primary w-100">Add</button>
  //       </div>
  //     </form>

  //     <table className="table table-bordered mt-3">
  //       <thead>
  //         <tr>
  //           <th>Product</th>
  //           <th>Qty</th>
  //           <th>Unit</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {items.map((i) => (
  //           <tr key={i._id}>
  //             <td>{i.productId?.name}</td>
  //             <td>{i.quantity}</td>
  //             <td>{i.unit}</td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>

  //     {rfq.status === "draft" && (
  //       <button className="btn btn-success mt-3" onClick={publishRFQ}>
  //         Publish RFQ
  //       </button>
  //     )}
  //     {rfq.status === "published" && (
  //       <Link className="btn btn-warning mt-3" to={`/rfq/${rfq._id}/compare`}>
  //         Compare Quotes
  //       </Link>
  //     )}
  //   </div>
  // );
  if (!rfq) return <div>Loading...</div>;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <h3 className="page-title">
        {rfq.title} <span className="text-muted">({rfq.rfqNumber})</span>
      </h3>

      {/* RFQ Info */}
      <div className="settings-card mb-4">
        <p>
          <strong>Status:</strong>{" "}
          <span className="badge bg-secondary text-uppercase">
            {rfq.status}
          </span>
        </p>

        <h6 className="mt-3 mb-2">Suppliers</h6>
        <ul className="mb-0">
          {rfq.suppliers.map((s) => (
            <li key={s._id}>
              {s.name} <span className="text-muted">({s.email})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Add Items */}
      <div className="settings-card mb-4">
        <h5 className="mb-3">Add Items</h5>

        <form className="row g-3" onSubmit={addItem}>
          <div className="col-md-4">
            <label className="form-label">Product</label>
            <select
              className="form-control"
              value={newItem.productId}
              onChange={(e) =>
                setNewItem({ ...newItem, productId: e.target.value })
              }
              required
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              className="form-control"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Unit</label>
            <input
              className="form-control"
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            />
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary w-100">Add</button>
          </div>
        </form>
      </div>

      {/* Items Table */}
      <div className="settings-card">
        <h5 className="mb-3">RFQ Items</h5>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-4">
                    No items added yet
                  </td>
                </tr>
              ) : (
                items.map((i) => (
                  <tr key={i._id}>
                    <td>{i.productId?.name || "-"}</td>
                    <td>{i.quantity}</td>
                    <td>{i.unit}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 text-end">
        {rfq.status === "draft" && (
          <button className="btn btn-success px-4" onClick={publishRFQ}>
            Publish RFQ
          </button>
        )}

        {rfq.status === "published" && (
          <Link className="btn btn-warning px-4" to={`/rfq/${rfq._id}/compare`}>
            Compare Quotes
          </Link>
        )}
      </div>
    </div>
  );
}
