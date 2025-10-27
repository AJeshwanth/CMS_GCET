import React, { useState, useEffect } from 'react';
import UserLayout from '../components/UserLayout';
import { useNotification } from '../hooks/useNotification';
import { FaSearch } from 'react-icons/fa';
import '../styles/UserDashboard.css';

export default function UserComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const { addNotification } = useNotification();
  const username = localStorage.getItem("user");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/complaints`)
      .then((res) => res.json())
      .then((data) => setComplaints(data.filter(c => c.submittedBy === username)))
      .catch((err) => {
        console.error('Error fetching complaints:', err);
        addNotification('Error fetching complaints', 'error');
      });
  }, [addNotification, username]);

  const handleEdit = (c) => {
    setEditId(c._id);
    setEditData({ title: c.title, description: c.description, category: c.category, location: c.location });
  };

  const handleSave = (_id) => {
    fetch(`${API_BASE_URL}/api/editcomplaints/${_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update");
        return res.json();
      })
      .then(() => {
        const updated = complaints.map(c =>
          c._id === _id ? { ...c, ...editData } : c
        );
        setComplaints(updated);
        setEditId(null);
        addNotification("Complaint edited successfully", "success");
      })
      .catch(err => {
        console.error("Error editing complaint:", err);
        addNotification("Error editing complaint", "error");
      });
  };

  const handleDelete = (_id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      fetch(`${API_BASE_URL}/api/deletecomplaints/${_id}`, { method: "DELETE" })
        .then(res => {
          if (!res.ok) throw new Error("Failed to delete");
          setComplaints(complaints.filter(c => c._id !== _id));
          addNotification("Complaint deleted successfully", "success");
        })
        .catch(err => {
          console.error("Error deleting complaint:", err);
          addNotification("Error deleting complaint", "error");
        });
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      (c.title?.toLowerCase().includes(term)) ||
      (c.description?.toLowerCase().includes(term)) ||
      (c.category?.toLowerCase().includes(term)) ||
      (c.location?.toLowerCase().includes(term)) ||
      (c.status?.toLowerCase().includes(term))
    );
  });

  const gradientStyle = {
    background: 'linear-gradient(135deg, #010b05, #14532d)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '4px 8px',
    transition: '0.3s',
  };

  return (
    <UserLayout>
      <div className="page-grid">
        <h2 className="dashboard-title mb-4">My Complaints</h2>
        <div className="card complaints-card">

          <div className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search my complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="input-group-text bg-white">
                <FaSearch className="text-muted" />
              </span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover rounded-table">
              <thead className="table-dark rounded-header">
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Date Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((c) => (
                    <tr key={c._id} className="bouncy-row">
                      <td>
                        {editId === c._id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editData.title}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          />
                        ) : (
                          c.title
                        )}
                      </td>
                      <td>
                        {editId === c._id ? (
                          <textarea
                            className="form-control"
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          />
                        ) : (
                          <button
                            className="btn btn-sm shadow-sm"
                            style={gradientStyle}
                            onClick={() => alert(c.description)}
                          >
                            Show Description
                          </button>
                        )}
                      </td>
                      <td>
                        {editId === c._id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editData.category}
                            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                          />
                        ) : (
                          c.category || "-"
                        )}
                      </td>
                      <td>
                        {editId === c._id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editData.location}
                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                          />
                        ) : (
                          c.location || "-"
                        )}
                      </td>
                      <td>{new Date(c.createdAt).toLocaleString()}</td>
                      <td>
                        <span className="badge rounded-pill bg-light text-dark px-3 py-2 shadow-sm">
                          {c.status}
                        </span>
                      </td>
                      <td>
                        {editId === c._id ? (
                          <>
                            <button
                              className="btn btn-sm shadow-sm me-2"
                              style={gradientStyle}
                              onClick={() => handleSave(c._id)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-sm shadow-sm"
                              style={gradientStyle}
                              onClick={() => setEditId(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          c.status.toLowerCase() === "resolved" ? (
                            <span className="text-muted">-</span>
                          ) : (
                            <>
                              <button
                                className="btn btn-sm shadow-sm me-2"
                                style={gradientStyle}
                                onClick={() => handleEdit(c)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm shadow-sm"
                                style={gradientStyle}
                                onClick={() => handleDelete(c._id)}
                              >
                                Delete
                              </button>
                            </>
                          )
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No complaints found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
