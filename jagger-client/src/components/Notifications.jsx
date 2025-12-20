import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Notifications() {
  const [notes, setNotes] = useState([]);
  const [open, setOpen] = useState(false);

  const loadNotes = async () => {
    const res = await api.get("/notifications");
    setNotes(res.data);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const unreadCount = notes.filter((n) => !n.isRead).length;

  const markRead = async () => {
    await api.put("/notifications/read");
    loadNotes();
  };

  return (
    <div className="position-relative">
      {/* Bell Icon */}
      <span
        style={{ cursor: "pointer", fontSize: "20px" }}
        onClick={() => {
          setOpen(!open);
          markRead();
        }}
      >
        🔔
      </span>

      {/* Badge */}
      {unreadCount > 0 && (
        <span
          className="badge bg-danger"
          style={{ position: "absolute", top: "-5px", right: "-10px" }}
        >
          {unreadCount}
        </span>
      )}

      {/* Dropdown */}
      {open && (
        <div
          className="card p-2"
          style={{
            position: "absolute",
            right: 0,
            top: "30px",
            width: "250px",
            zIndex: 1000,
          }}
        >
          {notes.length === 0 ? (
            <p className="text-center text-muted">No notifications</p>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="border-bottom p-2">
                {note.message}
                <br />
                <small className="text-muted">
                  {new Date(note.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
