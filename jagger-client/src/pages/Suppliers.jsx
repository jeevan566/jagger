import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const loadSuppliers = async () => {
      const res = await api.get("/suppliers");
      setSuppliers(res.data);
    };
    loadSuppliers();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/suppliers/${id}/status`, { status });

    // refresh suppliers
    const res = await api.get("/suppliers");
    setSuppliers(res.data);
  };

  const deleteSupplier = async (id) => {
    if (!confirm("Delete supplier?")) return;

    await api.delete(`/suppliers/${id}`);

    // refresh suppliers
    const res = await api.get("/suppliers");
    setSuppliers(res.data);
  };

  // return (
  //   <div>
  //     <div className="d-flex justify-content-between align-items-center mb-3">
  //       <h3>Supplier Management</h3>
  //       <Link to="/add-supplier" className="btn btn-primary">
  //         Add Supplier
  //       </Link>
  //     </div>

  //     <table className="table table-bordered">
  //       <thead className="table-dark">
  //         <tr>
  //           <th>Name</th>
  //           <th>Company</th>
  //           <th>Email</th>
  //           <th>Status</th>
  //           <th width="250">Actions</th>
  //         </tr>
  //       </thead>

  //       <tbody>
  //         {suppliers.map((s) => (
  //           <tr key={s._id}>
  //             <td>{s.name}</td>
  //             <td>{s.companyName}</td>
  //             <td>{s.email}</td>
  //             <td>
  //               <span
  //                 className={`badge bg-${
  //                   s.status === "approved"
  //                     ? "success"
  //                     : s.status === "rejected"
  //                     ? "danger"
  //                     : "secondary"
  //                 }`}
  //               >
  //                 {s.status}
  //               </span>
  //             </td>
  //             <td>
  //               <button
  //                 className="btn btn-sm btn-success me-2"
  //                 disabled={s.status === "approved"}
  //                 onClick={() => updateStatus(s._id, "approved")}
  //               >
  //                 Approve
  //               </button>

  //               <button
  //                 className="btn btn-sm btn-warning me-2"
  //                 disabled={s.status === "rejected"}
  //                 onClick={() => updateStatus(s._id, "rejected")}
  //               >
  //                 Reject
  //               </button>

  //               <button
  //                 className="btn btn-sm btn-danger"
  //                 onClick={() => deleteSupplier(s._id)}
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
    {/* Page Header */}
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h3 className="page-title mb-0">Supplier Management</h3>
      <Link to="/add-supplier" className="btn btn-primary">
        + Add Supplier
      </Link>
    </div>

    {/* Suppliers Table */}
    <div className="settings-card">
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Status</th>
              <th style={{ width: "260px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">
                  No suppliers found
                </td>
              </tr>
            ) : (
              suppliers.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.companyName}</td>
                  <td>{s.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        s.status === "approved"
                          ? "bg-success"
                          : s.status === "rejected"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-success"
                        disabled={s.status === "approved"}
                        onClick={() => updateStatus(s._id, "approved")}
                      >
                        Approve
                      </button>

                      <button
                        className="btn btn-sm btn-warning text-dark"
                        disabled={s.status === "rejected"}
                        onClick={() => updateStatus(s._id, "rejected")}
                      >
                        Reject
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteSupplier(s._id)}
                      >
                        Delete
                      </button>
                    </div>
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
