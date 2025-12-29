import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      const res = await api.get("/audit");
      setLogs(res.data);
    };
    loadLogs();
  }, []);

  // return (
  //   <div>
  //     <h3>Audit Log</h3>

  //     <table className="table mt-4">
  //       <thead className="table-dark">
  //         <tr>
  //           <th>User</th>
  //           <th>Role</th>
  //           <th>Action</th>
  //           <th>Details</th>
  //           <th>Timestamp</th>
  //         </tr>
  //       </thead>

  //       <tbody>
  //         {logs.map((log) => (
  //           <tr key={log._id}>
  //             <td>{log.userId?.name}</td>
  //             <td>{log.userId?.role}</td>
  //             <td>{log.action}</td>
  //             <td>{log.details}</td>
  //             <td>{new Date(log.createdAt).toLocaleString()}</td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );
  return (
    <div className="page-wrapper">
      <h3 className="page-title">Audit Logs</h3>

      <div className="settings-card">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Details</th>
                <th>Timestamp</th>
              </tr>
            </thead>

            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No audit logs available
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id}>
                    <td>{log.userId?.name || "-"}</td>
                    <td>
                      <span className="badge bg-info text-dark">
                        {log.userId?.role || "-"}
                      </span>
                    </td>
                    <td>
                      <span className="fw-semibold">{log.action}</span>
                    </td>
                    <td>{log.details}</td>
                    <td className="text-muted">
                      {new Date(log.createdAt).toLocaleString()}
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
