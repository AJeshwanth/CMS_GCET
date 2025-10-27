import React, { useState, useEffect } from 'react';
import UserLayout from '../components/UserLayout';
import { useNotification } from '../hooks/useNotification';
import { FaSearch } from 'react-icons/fa';
import { Forward } from 'lucide-react';
import '../styles/UserDashboard.css';

export default function ActiveComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDescription, setSelectedDescription] = useState(null);
  const { addNotification } = useNotification();

  const username = localStorage.getItem("user");
  const role = localStorage.getItem("role"); 
  const deptCategory = localStorage.getItem("issue"); 
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  useEffect(() => {
    let url = `${API_BASE_URL}/api/complaints`;

    if (role === "department") {
      url += `?category=${deptCategory}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let filteredData = data;
        if (role === "department") {
          filteredData = data.filter(c => c.category === deptCategory);
        }

        setComplaints(filteredData);
      })
      .catch((err) => {
        console.error('Error fetching complaints:', err);
        addNotification('Error fetching complaints', 'error');
      });
  }, [addNotification, username, role, deptCategory]);

  const changeStatus = (_id, newStatus) => {
    if (role !== "admin" && role !== "department") {
      addNotification("Only admin or department can change status", "error");
      return;
    }

    if (window.confirm(`Change status to ${newStatus}?`)) {
      fetch(`${API_BASE_URL}/api/updatecomplaints/${_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to update");
          return res.json();
        })
        .then(() => {
          const updatedComplaints = complaints.map(c =>
            c._id === _id ? { ...c, status: newStatus } : c
          );
          setComplaints(updatedComplaints);
          addNotification(`Complaint status updated to ${newStatus}`, 'success');
        })
        .catch(err => {
          console.error("Error updating status:", err);
          addNotification('Error updating complaint status', 'error');
        });
    }
  };

  const forwardComplaint = async (complaintId) => {
    if (role !== "admin") return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/forward/${complaintId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to forward complaint");

      const data = await res.json();
      addNotification(data.message || "Complaint forwarded successfully", "success");

      alert("✅ Complaint has been forwarded successfully!");
      
    } catch (err) {
      console.error("Error forwarding complaint:", err);
      addNotification("Error forwarding complaint", "error");
    }
  };

  // Filter active complaints (status not resolved)
  const activeComplaints = complaints.filter(c => c.status?.toLowerCase() !== 'resolved');

  // Search filter
  const filteredComplaints = activeComplaints.filter(c => {
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
    transition: '0.3s',
  };

  return (
    <UserLayout>
      <div className="page-grid">
        <h2 className="dashboard-title mb-4">Active Complaints</h2>
        <div className="card complaints-card">

          {/* Search Bar */}
          <div className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search active complaints..."
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
                  {(role === "admin") && <th>Forward</th>}
                  {(role === "admin" || role === "department") && <th>Actions</th>}
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
                          style={{
                            ...gradientStyle,
                            borderRadius: '8px',
                            padding: '4px 8px',
                          }}
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
                        {(role === "admin" || role === "department") ? (
                          <select
                            value={c.status}
                            className="form-select form-select-sm"
                            onChange={(e) => changeStatus(c._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        ) : (
                          <span className="badge rounded-pill bg-light text-dark px-3 py-2 shadow-sm">
                            {c.status}
                          </span>
                        )}
                      </td>
                      {(role === "admin") && (
                        <td>
                          <button
                            className="btn btn-sm shadow-sm d-flex align-items-center justify-content-center"
                            style={{
                              ...gradientStyle,
                              borderRadius: '8px',
                              gap: '4px',
                            }}
                            onClick={() => forwardComplaint(c._id)}
                            title="Forward Complaint"
                          >
                            <Forward size={16} />
                          </button>
                        </td>
                      )}
                      {(role === "admin" || role === "department") && (
                        <td>
                          <button
                            className="btn btn-sm shadow-sm"
                            style={{
                              ...gradientStyle,
                              borderRadius: '8px',
                              padding: '4px 10px',
                            }}
                            onClick={() => changeStatus(c._id, 'Resolved')}
                          >
                            Quick Resolve
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={(role === "admin") ? "9" : (role === "department" ? "8" : "7")} className="text-center py-5 text-muted">
                      No active complaints found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {selectedDescription && (
            <div className="modal-overlay" onClick={() => setSelectedDescription(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h5>Description</h5>
                <p>{selectedDescription}</p>
                <button
                  className="btn shadow-sm"
                  style={{
                    ...gradientStyle,
                    borderRadius: '8px',
                    padding: '6px 12px',
                  }}
                  onClick={() => setSelectedDescription(null)}
                >
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
