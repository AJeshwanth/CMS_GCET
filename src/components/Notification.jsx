import React, { useState, useEffect } from "react";
import "../styles/Notification.css";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notifications")) || [
      {
        id: 1,
        type: "New Complaint",
        message: "A new complaint has been registered.",
        date: new Date().toLocaleString(),
        edited: false,
        read: false,
      },
      {
        id: 2,
        type: "Status Change",
        message: "Your complaint #101 has been resolved.",
        date: new Date().toLocaleString(),
        edited: false,
        read: false,
      },
    ];
    setNotifications(stored);
    setUnreadCount(stored.filter((n) => !n.read).length);
  }, []);

  const markRead = (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.read).length);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    setUnreadCount(0);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  return (
    <div className="notification-page" style={{ paddingLeft: "250px" }}>
      {/* Adjust paddingLeft according to your navbar width */}
      <div className="notification-header">
        <h2>
          Notifications{" "}
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </h2>
        {unreadCount > 0 && (
          <button className="mark-all-btn" onClick={markAllRead}>
            Mark all as read
          </button>
        )}
      </div>

      <ul className="notification-list">
        {notifications.length === 0 ? (
          <p className="no-notifications">No notifications</p>
        ) : (
          notifications.map((n) => (
            <li
              key={n.id}
              className={`notification-item ${n.read ? "read" : "unread"}`}
            >
              <div className="notification-info">
                <strong>{n.type}</strong>
                <p>{n.message}</p>
                <span className="notification-time">
                  {n.date} {n.edited && <span className="edited">✎</span>}
                </span>
              </div>
              {!n.read && (
                <button className="tick-btn" onClick={() => markRead(n.id)}>✅</button>

              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
