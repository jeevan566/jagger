import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function RFQs() {
  const [rfqs, setRfqs] = useState([]);

  useEffect(() => {
    const loadRFQs = async () => {
      const res = await api.get("/rfqs");
      setRfqs(res.data);
    };
    loadRFQs();
  }, []);

  // return (
  //   <div>
  //     <div className="d-flex justify-content-between mb-3">
  //       <h3>RFQ List</h3>
  //       <Link className="btn btn-primary" to="/create-rfq">
  //         Create RFQ
  //       </Link>
  //     </div>

  //     <table className="table table-bordered">
  //       <thead className="table-dark">
  //         <tr>
  //           <th>RFQ Number</th>
  //           <th>Title</th>
  //           <th>Status</th>
  //           <th>Suppliers</th>
  //           <th width="150">Actions</th>
  //         </tr>
  //       </thead>

  //       <tbody>
  //         {rfqs.map((r) => (
  //           <tr key={r._id}>
  //             <td>{r.rfqNumber}</td>
  //             <td>{r.title}</td>
  //             <td>{r.status}</td>
  //             <td>{r.suppliers.map((s) => s.name).join(", ")}</td>
  //             <td>
  //               <Link to={`/rfq/${r._id}`} className="btn btn-sm btn-info">
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="page-title mb-0">RFQs</h3>
        <Link className="btn btn-primary" to="/create-rfq">
          + Create RFQ
        </Link>
      </div>

      <div className="settings-card">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>RFQ Number</th>
                <th>Title</th>
                <th>Status</th>
                <th>Suppliers</th>
                <th style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {rfqs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No RFQs found
                  </td>
                </tr>
              ) : (
                rfqs.map((r) => (
                  <tr key={r._id}>
                    <td>{r.rfqNumber}</td>
                    <td>{r.title}</td>
                    <td>
                      <span className="badge bg-info text-dark">
                        {r.status}
                      </span>
                    </td>
                    <td>{r.suppliers.map((s) => s.name).join(", ")}</td>
                    <td>
                      <Link
                        to={`/rfq/${r._id}`}
                        className="btn btn-sm btn-primary"
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
