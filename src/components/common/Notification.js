import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const Notification = ({ show, message, type = 'success', onClose }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose && onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return 'fas fa-check-circle';
      case 'error': return 'fas fa-exclamation-circle';
      case 'warning': return 'fas fa-exclamation-triangle';
      default: return 'fas fa-info-circle';
    }
  };

  const getBg = () => {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast show={visible} onClose={() => setVisible(false)} bg={getBg()}>
        <Toast.Body className="text-white d-flex align-items-center">
          <i className={`${getIcon()} me-2`}></i>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default Notification;