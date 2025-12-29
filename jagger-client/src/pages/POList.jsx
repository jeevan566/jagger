import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function POList() {
  const [pos, setPos] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/pos");
      setPos(res.data);
    };
    load();
  }, []);

  // return (
  //   <div>
  //     <h3>Purchase Orders</h3>

  //     <table className="table table-bordered mt-3">
  //       <thead className="table-dark">
  //         <tr>
  //           <th>PO Number</th>
  //           <th>Supplier</th>
  //           <th>Status</th>
  //           <th width="150">Actions</th>
  //         </tr>
  //       </thead>

  //       <tbody>
  //         {pos.map((p) => (
  //           <tr key={p._id}>
  //             <td>{p.poNumber}</td>
  //             <td>{p.supplierId.name}</td>
  //             <td>{p.status}</td>
  //             <td>
  //               <Link className="btn btn-info btn-sm" to={`/po/${p._id}`}>
  //                 View
  //               </Link>
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );
  return (
    <div className="page-wrapper">
      <h3 className="page-title">Purchase Orders</h3>

      <div className="settings-card">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>PO Number</th>
                <th>Supplier</th>
                <th>Status</th>
                <th style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {pos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    No purchase orders found
                  </td>
                </tr>
              ) : (
                pos.map((p) => (
                  <tr key={p._id}>
                    <td>{p.poNumber}</td>
                    <td>{p.supplierId.name}</td>
                    <td>
                      <span className="badge bg-info text-dark">
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        className="btn btn-sm btn-primary"
                        to={`/po/${p._id}`}
                      >
                        View
                      </Link>
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
