// UserComplaintCard.jsx
import React from 'react';
import '../styles/Card.css';


const UserComplaintCard = ({ complaint }) => {
  return (
    <div className="card">
      <h3><strong>{complaint.title}</strong></h3>
      <p><strong>Description:</strong> {complaint.description}</p>
      <p><strong>Category:</strong> {complaint.category}</p>
      <p><strong>Status:</strong> {complaint.status}</p>
    </div>
  );
};

export default UserComplaintCard;
