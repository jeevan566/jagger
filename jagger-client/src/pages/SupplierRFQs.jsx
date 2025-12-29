import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function SupplierRFQs() {
  const [rfqs, setRfqs] = useState([]);

  useEffect(() => {
    const loadRFQs = async () => {
      const res = await api.get("/quotes/my-rfqs");
      setRfqs(res.data);
    };
    loadRFQs();
  }, []);

  // return (
  //   <div>
  //     <h3>RFQs Assigned to You</h3>

  //     <table className="table table-bordered mt-3">
  //       <thead className="table-dark">
  //         <tr>
  //           <th>RFQ Number</th>
  //           <th>Title</th>
  //           <th>Action</th>
  //         </tr>
  //       </thead>

  //       <tbody>
  //         {rfqs.map((r) => (
  //           <tr key={r._id}>
  //             <td>{r.rfqNumber}</td>
  //             <td>{r.title}</td>
  //             <td>
  //               <Link
  //                 className="btn btn-sm btn-primary"
  //                 to={`/submit-quote/${r._id}`}
  //               >
  //                 Submit Quote
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
      <h3 className="page-title">RFQs Assigned to You</h3>

      <div className="settings-card">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>RFQ Number</th>
                <th>Title</th>
                <th style={{ width: "180px" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {rfqs.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-4">
                    No RFQs assigned
                  </td>
                </tr>
              ) : (
                rfqs.map((r) => (
                  <tr key={r._id}>
                    <td>{r.rfqNumber}</td>
                    <td>{r.title}</td>
                    <td>
                      <Link
                        className="btn btn-sm btn-primary"
                        to={`/submit-quote/${r._id}`}
                      >
                        Submit Quote
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
