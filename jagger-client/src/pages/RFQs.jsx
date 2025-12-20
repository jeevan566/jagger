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

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h3>RFQ List</h3>
        <Link className="btn btn-primary" to="/create-rfq">
          Create RFQ
        </Link>
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>RFQ Number</th>
            <th>Title</th>
            <th>Status</th>
            <th>Suppliers</th>
            <th width="150">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rfqs.map((r) => (
            <tr key={r._id}>
              <td>{r.rfqNumber}</td>
              <td>{r.title}</td>
              <td>{r.status}</td>
              <td>{r.suppliers.map((s) => s.companyName).join(", ")}</td>
              <td>
                <Link to={`/rfq/${r._id}`} className="btn btn-sm btn-info">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
