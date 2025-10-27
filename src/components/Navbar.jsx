import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  FolderKanban,
  BarChart3,
  ChevronDown,
  ChevronRight,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import '../styles/Navbar.css';

export default function Navbar({ role }) {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('sidebarPinned') !== 'true'
  );
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(
    () => localStorage.getItem('sidebarPinned') === 'true'
  );
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (collapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
    return () => {
      document.body.classList.remove('sidebar-collapsed');
    };
  }, [collapsed]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('issue');
    navigate('/');
  };

  const navClass = ({ isActive }) => (isActive ? 'active' : '');

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleEnter = () => {
      if (!isPinned) setCollapsed(false);
    };
    const handleLeave = () => {
      if (!isPinned) {
        setCollapsed(true);
        setDashboardOpen(false);
      }
    };

    sidebar.addEventListener('mouseenter', handleEnter);
    sidebar.addEventListener('mouseleave', handleLeave);

    return () => {
      sidebar.removeEventListener('mouseenter', handleEnter);
      sidebar.removeEventListener('mouseleave', handleLeave);
    };
  }, [isPinned]);

  const handleToggle = () => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    localStorage.setItem('sidebarPinned', newPinned.toString());
    setCollapsed(!newPinned);
  };

  return (
    <aside
      ref={sidebarRef}
      className={`modern-sidebar ${collapsed ? 'collapsed' : ''}`}
    >
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="brand">Complaint Portal</div>
        <button className="toggle-btn" onClick={handleToggle}>
          {isPinned ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <ul className="nav-links">
        {/* Dashboard */}
        <li>
          <NavLink to={`/${role}`} className={navClass}>
            <LayoutDashboard size={18} className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/new-complaint" className={navClass}>
            <PlusCircle size={18} className="nav-icon" />
            <span className="nav-text">New Complaint</span>
          </NavLink>
        </li>

        {/* My Complaints - only for users */}
        {role === 'user' && (
          <li>
            <NavLink to="/user/complaints" className={navClass}>
              <FolderKanban size={18} className="nav-icon" />
              <span className="nav-text">My Complaints</span>
            </NavLink>
          </li>
        )}

        {/* Complaints Dropdown */}
        <li className={`dropdown-container ${dashboardOpen ? 'open' : ''}`}>
          <button
            className={`dropdown-btn ${dashboardOpen ? 'expanded' : ''}`}
            onClick={() => setDashboardOpen(!dashboardOpen)}
          >
            <BarChart3 size={18} className="nav-icon" />
            <span className="nav-text">Complaints</span>
            <ChevronDown size={16} className="caret" />
          </button>
          <ul className={`submenu ${dashboardOpen ? 'open' : ''}`}>
            <li>
              <NavLink to={`/${role}/active-complaints`} className={navClass}>
                Active Complaints
              </NavLink>
            </li>
            <li>
              <NavLink to={`/${role}/resolved-complaints`} className={navClass}>
                Resolved Complaints
              </NavLink>
            </li>
          </ul>
        </li>
      </ul>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="logout" onClick={handleLogout}>
          <LogOut size={18} className="nav-icon" />
          <span className="nav-text">Logout</span>
        </button>
      </div>
    </aside>
  );
}
