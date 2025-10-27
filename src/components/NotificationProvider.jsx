// src/providers/NotificationProvider.jsx
import React, { useState, useEffect } from "react";
import { NotificationContext } from "../contexts/NotificationContext";

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(stored);
  }, []);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (message, type = "info") => {
    const newNotification = {
      id: Date.now() + Math.random(),
      type,
      message,
      date: new Date().toLocaleString(),
      edited: false,
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]); // latest first
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const editNotification = (id, newMsg) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              message: newMsg,
              date: new Date().toLocaleString(),
              edited: true,
            }
          : n
      )
    );
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markRead, markAllRead, editNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
