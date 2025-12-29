import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function PODetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [po, setPo] = useState(null);

  useEffect(() => {
    const loadPO = async () => {
      const res = await api.get(`/pos/${id}`);
      setPo(res.data);
    };
    loadPO();
  }, [id]);

  const approvePO = async () => {
    await api.put(`/pos/${id}/approve`);
    alert("PO Approved and emailed to supplier");
    refreshPO();
  };

  const rejectPO = async () => {
    await api.put(`/pos/${id}/reject`);
    alert("PO Rejected");
    refreshPO();
  };

  // Reusable fetch for after approve/reject
  const refreshPO = async () => {
    const res = await api.get(`/pos/${id}`);
    setPo(res.data);
  };

  // if (!po) return <p>Loading...</p>;

  // return (
  //   <div>
  //     <h3>PO Details - {po.poNumber}</h3>

  //     <p>
  //       Status: <b>{po.status.toUpperCase()}</b>
  //     </p>

  //     {/* Approval Buttons for Managers and Admins */}
  //     {po.status === "pending" &&
  //       (user?.role === "manager" || user?.role === "admin") && (
  //         <div className="mt-3">
  //           <button className="btn btn-success me-2" onClick={approvePO}>
  //             Approve PO
  //           </button>

  //           <button className="btn btn-danger" onClick={rejectPO}>
  //             Reject PO
  //           </button>
  //         </div>
  //       )}

  //     <hr />

  //     <h5>Supplier: {po.supplierId.name}</h5>

  //     <table className="table table-bordered mt-3">
  //       <thead>
  //         <tr>
  //           <th>Product</th>
  //           <th>Qty</th>
  //           <th>Unit</th>
  //           <th>Price</th>
  //           <th>Total</th>
  //         </tr>
  //       </thead>

  //       <tbody>
  //         {po.items.map((item) => (
  //           <tr key={item._id}>
  //             <td>{item.productId.name}</td>
  //             <td>{item.quantity}</td>
  //             <td>{item.unit}</td>
  //             <td>{item.price}</td>
  //             <td>{item.total}</td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );
  if (!po) return <p>Loading...</p>;

  return (
    <div className="page-wrapper">
      <h3 className="page-title">
        PO Details <span className="text-muted">#{po.poNumber}</span>
      </h3>

      <div className="settings-card mb-4">
        <p>
          <strong>Status:</strong>{" "}
          <span className="badge bg-secondary text-uppercase">{po.status}</span>
        </p>

        {/* Approval Buttons */}
        {po.status === "pending" &&
          (user?.role === "manager" || user?.role === "admin") && (
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-success" onClick={approvePO}>
                Approve PO
              </button>
              <button className="btn btn-danger" onClick={rejectPO}>
                Reject PO
              </button>
            </div>
          )}
      </div>

      <div className="settings-card">
        <h5 className="mb-3">
          Supplier: <strong>{po.supplierId.name}</strong>
        </h5>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {po.items.map((item) => (
                <tr key={item._id}>
                  <td>{item.productId.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td>{item.price}</td>
                  <td>{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
