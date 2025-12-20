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

  return (
    <div>
      <h3>Audit Log</h3>

      <table className="table mt-4">
        <thead className="table-dark">
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Action</th>
            <th>Details</th>
            <th>Timestamp</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{log.userId?.name}</td>
              <td>{log.userId?.role}</td>
              <td>{log.action}</td>
              <td>{log.details}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
