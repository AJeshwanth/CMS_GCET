import React, { useState, useEffect } from 'react';
import UserLayout from '../components/UserLayout';
import { useNotification } from '../hooks/useNotification';
import { FaSearch } from 'react-icons/fa';
import '../styles/UserDashboard.css';

export default function ResolvedComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDescription, setSelectedDescription] = useState(null);
  const { addNotification } = useNotification();

  const username = localStorage.getItem("user");
  const role = localStorage.getItem("role"); // "admin", "department", "user"
  const deptCategory = localStorage.getItem("issue"); // department assigned category
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  useEffect(() => {
    let url = `${API_BASE_URL}api/complaints`;

    // For department, fetch only complaints in their assigned category
    if (role === "department") {
      url += `?category=${deptCategory}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let filteredData = data;

        // Role-based filtering
        if (role === "department") {
          filteredData = data.filter(c => c.category === deptCategory);
        }
        // admin sees all complaints

        setComplaints(filteredData);
      })
      .catch((err) => {
        console.error('Error fetching complaints:', err);
        addNotification('Error fetching complaints', 'error');
      });
  }, [addNotification, username, role, deptCategory]);

  // Only resolved complaints
  const resolvedComplaints = complaints.filter(c => c.status?.toLowerCase() === 'resolved');

  // Search filter
  const filteredComplaints = resolvedComplaints.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      (c.title?.toLowerCase().includes(term)) ||
      (c.description?.toLowerCase().includes(term)) ||
      (c.category?.toLowerCase().includes(term)) ||
      (c.location?.toLowerCase().includes(term)) ||
      (c.submittedBy?.toLowerCase().includes(term)) ||
      (c.status?.toLowerCase().includes(term))
    );
  });

  const gradientStyle = {
    background: 'linear-gradient(135deg, #010b05, #14532d)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '4px 8px',
    transition: '0.3s',
  };

  return (
    <UserLayout>
      <div className="page-grid">
        <h2 className="dashboard-title mb-4">Resolved Complaints</h2>
        <div className="card complaints-card">

          {/* Search Bar */}
          <div className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search resolved complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="input-group-text bg-white">
                <FaSearch className="text-muted" />
              </span>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="table-responsive">
            <table className="table table-hover rounded-table">
              <thead className="table-dark rounded-header">
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Date Submitted</th>
                  <th>Submitted By</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((c) => (
                    <tr key={c._id} className="bouncy-row">
                      <td>{c.title}</td>
                      <td>
                        <button
                          className="btn btn-sm shadow-sm"
                          style={gradientStyle}
                          onClick={() => setSelectedDescription(c.description)}
                        >
                          Show Description
                        </button>
                      </td>
                      <td>{c.category || "-"}</td>
                      <td>{c.location || "-"}</td>
                      <td>{new Date(c.createdAt).toLocaleString()}</td>
                      <td>{c.submittedBy}</td>
                      <td>
                        <span className="badge rounded-pill bg-light text-dark px-3 py-2 shadow-sm">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No resolved complaints found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Description Modal */}
          {selectedDescription && (
            <div className="modal-overlay" onClick={() => setSelectedDescription(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h5>Description</h5>
                <p>{selectedDescription}</p>
                <button className="btn shadow-sm" style={gradientStyle} onClick={() => setSelectedDescription(null)}>
                  Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </UserLayout>
  );
}
