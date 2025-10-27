import React, { useState, useRef, useEffect } from "react";
import UserLayout from "../components/UserLayout";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../hooks/useNotification";
import { FileText, Send, RefreshCw, Search } from "lucide-react";
import "../styles/NewComplaint.css";

export default function NewComplaint() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const categories = [
    "Academic Areas",
    "Staff & Administration",
    "Basic Facilities",
    "Technical & Utilities",
    "Canteen & Dining",
    "Sports & Recreation",
    "Transportation & Access",
    "Accessibility & Safety",
    "Digital Infrastructure",
    "Serious / Personal Issues",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = localStorage.getItem("user");
    const complaintData = {
      title,
      description,
      category,
      location,
      submittedBy: user || "anonymous",
    };
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
    try {
      const response = await fetch(`${API_BASE_URL}/api/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaintData),
      });

      if (response.ok) {
        addNotification("Complaint submitted successfully!", "success");
        setTimeout(() => navigate(-1), 1500);
      } else {
        addNotification("Failed to submit complaint", "error");
      }
    } catch (error) {
      addNotification("Error submitting complaint", "error");
      console.error(error);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const gradientStyle = {
    background: "linear-gradient(135deg, #14532d, #198754)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
  };

  return (
    <UserLayout>
      <div className="container mt-5">
        <div className="modern-card">
          <h2 className="form-title flex items-center gap-2">
            <FileText size={22} /> File a New Complaint
          </h2>

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="modern-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Short descriptive title"
              />
            </div>

            <div className="form-group dropdown-wrapper" ref={dropdownRef}>
              <label className="form-label">Category</label>
              <div
                className="modern-input relative"
                onClick={() => setOpen(!open)}
              >
                <input
                  type="text"
                  value={category}
                  placeholder="Select a category"
                  readOnly
                />
                <Search size={18} className="absolute right-2 top-2.5 text-gray-400" />
              </div>

              {open && (
                <div className="dropdown-portal">
                  <input
                    type="text"
                    placeholder="Search category..."
                    className="dropdown-search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                  <div className="dropdown-options">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((cat, i) => (
                        <div
                          key={i}
                          className="dropdown-option"
                          onClick={() => {
                            setCategory(cat);
                            setOpen(false);
                            setSearch("");
                          }}
                        >
                          {cat}
                        </div>
                      ))
                    ) : (
                      <div className="dropdown-option text-muted">
                        No category found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="modern-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="e.g., Class 111, Library Section B"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="modern-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Describe the issue in detail"
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn-submit" style={gradientStyle}>
                <Send size={18} /> Submit Complaint
              </button>
              <button
                type="button"
                className="btn-reset"
                style={gradientStyle}
                onClick={() => {
                  setTitle("");
                  setDescription("");
                  setCategory("");
                  setLocation("");
                }}
              >
                <RefreshCw size={18} /> Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </UserLayout>
  );
}
