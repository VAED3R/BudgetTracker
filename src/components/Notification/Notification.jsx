import React from 'react';
import './Notification.css'; // Add custom styles for the notification

const Notification = ({ message, onClose }) => {
  return (
    <div className="notification">
      <span>{message}</span>
      <button className="close-btn" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Notification;
