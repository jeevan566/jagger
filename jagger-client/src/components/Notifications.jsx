import React, { useEffect, useState, useRef } from "react";
import api from "../api/api";

export default function Notifications() {
  const [notes, setNotes] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loadNotes = async () => {
    const res = await api.get("/notifications");
    setNotes(res.data);
  };

  useEffect(() => {
    loadNotes();

    // Close dropdown on outside click
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notes.filter((n) => !n.isRead).length;

  const markRead = async () => {
    if (unreadCount > 0) {
      await api.put("/notifications/read");
      loadNotes();
    }
  };

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      {/* Bell */}
      <div
        className="notification-bell"
        onClick={() => {
          setOpen(!open);
          markRead();
        }}
      >
        <i className="bi bi-bell"></i>

        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            Notifications
          </div>

          {notes.length === 0 ? (
            <div className="dropdown-empty">
              No notifications
            </div>
          ) : (
            <div className="dropdown-list">
              {notes.map((note) => (
                <div key={note._id} className="dropdown-item">
                  <p className="mb-1">{note.message}</p>
                  <small className="text-muted">
                    {new Date(note.createdAt).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
