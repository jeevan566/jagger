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

  return (
    <div>
      <h3>Purchase Orders</h3>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>PO Number</th>
            <th>Supplier</th>
            <th>Status</th>
            <th width="150">Actions</th>
          </tr>
        </thead>

        <tbody>
          {pos.map((p) => (
            <tr key={p._id}>
              <td>{p.poNumber}</td>
              <td>{p.supplierId.name}</td>
              <td>{p.status}</td>
              <td>
                <Link className="btn btn-info btn-sm" to={`/po/${p._id}`}>
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
