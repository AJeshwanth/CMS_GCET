import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/UserLayout.css';
import '../styles/Navbar.css';

export default function UserLayout({ children }) {
  const role = localStorage.getItem('role') || 'student';
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(prevState => !prevState);
  };

  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
    return () => {
      document.body.classList.remove('sidebar-collapsed');
    };
  }, [isCollapsed]);

  return (
    <div className="app-shell">
      <Navbar
        role={role}
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
      />

      <div className="menu-bar">
        <Link to="/user" className="dashboard-link">Dashboard</Link>
      </div>

      <main className="main-content">
        <div className="container">{children}</div>
      </main>

      {/* Professional Footer */}
      <footer className="app-footer">
        <div className="container text-center">
          <p>
            © {new Date().getFullYear()} • Developed by Ch. Akshara ,L. Hrithika ,A. Jeshwanth Raju
          </p>
        </div>
      </footer>
    </div>
  );
}
