import React, { useEffect, useState } from 'react';
import UserLayout from '../components/UserLayout';
import { useNotification } from '../hooks/useNotification';
import ComplaintsLineChart from '../components/ComplaintsLineChart';
import ComplaintsBarChart from '../components/ComplaintsBarChart';
import '../styles/DashboardCustom.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UserDashboard() {
  const user = { id: localStorage.getItem("user") };
  const [complaints, setComplaints] = useState([]);
  const { addNotification } = useNotification();
  const [zoomedChart, setZoomedChart] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/complaints`)
      .then(res => res.json())
      .then(data => setComplaints(data))
      .catch(() => addNotification('Error fetching complaints', 'error'));
  }, [addNotification]);

  const totalActive = complaints.filter(c => c.status !== 'Resolved');
  const totalResolved = complaints.filter(c => c.status === 'Resolved');

  const handleChartClick = (type) => {
    setZoomedChart(type);
    document.body.style.overflow = 'hidden';
  };

  const closeZoom = () => {
    setZoomedChart(null);
    document.body.style.overflow = 'auto';
  };

  const renderZoomOverlay = () => {
    if (!zoomedChart) return null;
    return (
      <div
        className="zoom-overlay d-flex justify-content-center align-items-center"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.75)',
          zIndex: 9999,
          backdropFilter: 'blur(3px)',
          padding: '20px',
        }}
        onClick={closeZoom}
      >
        <div
          className="zoom-box bg-white rounded shadow-lg position-relative p-3"
          style={{
            width: '95%',
            maxWidth: '900px',
            height: '80vh',
            overflow: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={closeZoom}
            className="btn-close position-absolute"
            style={{ top: '10px', right: '15px', zIndex: 10000 }}
          ></button>
          {zoomedChart === 'line' && <ComplaintsLineChart complaints={complaints} />}
          {zoomedChart === 'bar' && <ComplaintsBarChart complaints={complaints} />}
        </div>
      </div>
    );
  };

  const renderChartContainers = () => (
    <div className="row g-4 mb-4">
      {/* Line Chart */}
      <div className="col-lg-6 col-md-12">
        <div
          className="chart-container bg-white border rounded p-2"
          style={{ height: '400px', cursor: 'pointer' }}
          onClick={() => handleChartClick('line')}
        >
          <ComplaintsLineChart complaints={complaints} />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="col-lg-6 col-md-12">
        <div
          className="chart-container bg-white border rounded p-2"
          style={{ height: '400px', cursor: 'pointer' }}
          onClick={() => handleChartClick('bar')}
        >
          <ComplaintsBarChart complaints={complaints} />
        </div>
      </div>
    </div>
  );

  return (
    <UserLayout>
      <div className="container my-4">
        <h2 className="mb-4 fw-bold text-success">Welcome, {user.id}</h2>

        {/* Dashboard Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="dashboard-card active p-4 text-center shadow-sm rounded">
              <h4>Total Active Complaints</h4>
              <p className="display-5 fw-bold">{totalActive.length}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-card resolved p-4 text-center shadow-sm rounded">
              <h4>Total Resolved Complaints</h4>
              <p className="display-5 fw-bold">{totalResolved.length}</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-card summary p-4 text-center shadow-sm rounded">
              <h4>Total Complaints</h4>
              <p className="display-5 fw-bold">{complaints.length}</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        {renderChartContainers()}

        {/* Zoom Overlay */}
        {renderZoomOverlay()}
      </div>
    </UserLayout>
  );
}
