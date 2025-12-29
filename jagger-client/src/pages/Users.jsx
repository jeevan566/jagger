import { useEffect, useState } from "react";
import api from "../api/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };
  useEffect(() => {
    const loadUsers = async () => {
      const res = await api.get("/users");
      setUsers(res.data);
    };
    loadUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;

    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  const updateUser = async () => {
    await api.put(`/users/${editData._id}`, editData);
    setEditData(null);
    fetchUsers();
  };

  // return (
  //   <div>
  //     <h3 className="mb-3">User Management</h3>

  //     {/* Users Table */}
  //     <table className="table table-bordered">
  //       <thead className="table-dark">
  //         <tr>
  //           <th>Name</th>
  //           <th>Email</th>
  //           <th>Role</th>
  //           <th width="180">Actions</th>
  //         </tr>
  //       </thead>

  //       <tbody>
  //         {users.map((u) => (
  //           <tr key={u._id}>
  //             <td>{u.name}</td>
  //             <td>{u.email}</td>
  //             <td>{u.role}</td>
  //             <td>
  //               <button
  //                 className="btn btn-sm btn-primary me-2"
  //                 onClick={() => setEditData(u)}
  //               >
  //                 Edit
  //               </button>

  //               <button
  //                 className="btn btn-sm btn-danger"
  //                 onClick={() => deleteUser(u._id)}
  //               >
  //                 Delete
  //               </button>
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>

  //     {/* Edit Modal */}
  //     {editData && (
  //       <div
  //         className="modal fade show d-block"
  //         style={{ background: "#00000055" }}
  //       >
  //         <div className="modal-dialog">
  //           <div className="modal-content">
  //             <div className="modal-header">
  //               <h5>Edit User</h5>
  //               <button
  //                 className="btn-close"
  //                 onClick={() => setEditData(null)}
  //               ></button>
  //             </div>

  //             <div className="modal-body">
  //               <input
  //                 className="form-control mb-2"
  //                 value={editData.name}
  //                 onChange={(e) =>
  //                   setEditData({ ...editData, name: e.target.value })
  //                 }
  //               />

  //               <input
  //                 className="form-control mb-2"
  //                 value={editData.email}
  //                 onChange={(e) =>
  //                   setEditData({ ...editData, email: e.target.value })
  //                 }
  //               />

  //               <select
  //                 className="form-control"
  //                 value={editData.role}
  //                 onChange={(e) =>
  //                   setEditData({ ...editData, role: e.target.value })
  //                 }
  //               >
  //                 <option value="admin">Admin</option>
  //                 <option value="manager">Manager</option>
  //                 <option value="supplier">Supplier</option>
  //               </select>
  //             </div>

  //             <div className="modal-footer">
  //               <button
  //                 className="btn btn-secondary"
  //                 onClick={() => setEditData(null)}
  //               >
  //                 Cancel
  //               </button>

  //               <button className="btn btn-primary" onClick={updateUser}>
  //                 Save Changes
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
  return (
    <div className="page-wrapper">
      {/* Page Title */}
      <h3 className="page-title">User Management</h3>

      {/* Users Table */}
      <div className="settings-card">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ width: "200px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge bg-info text-dark">{u.role}</span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setEditData(u)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteUser(u._id)}
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

      {/* Edit Modal */}
      {editData && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditData(null)}
                ></button>
              </div>

              <div className="modal-body">
                <label className="form-label">Name</label>
                <input
                  className="form-control mb-3"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />

                <label className="form-label">Email</label>
                <input
                  className="form-control mb-3"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />

                <label className="form-label">Role</label>
                <select
                  className="form-control"
                  value={editData.role}
                  onChange={(e) =>
                    setEditData({ ...editData, role: e.target.value })
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditData(null)}
                >
                  Cancel
                </button>

                <button className="btn btn-primary" onClick={updateUser}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
