import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { FaHome, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

const AdminHeader = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#fff', borderBottom: '3px solid #ffd60a' }}>
      <div className="container-fluid px-4">
        <span className="navbar-brand mb-0 h1" style={{ color: '#333', fontWeight: 'bold' }}>
          <FaTachometerAlt className="me-2" style={{ color: '#ffd60a' }} />
          BlinkIt Admin
        </span>
        
        <div className="d-flex align-items-center">
          <span className="me-3" style={{ color: '#666' }}>Welcome, {currentUser?.name || 'Admin'}</span>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate('/')}
            className="me-2"
          >
            <FaHome className="me-1" />
            Store
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-1" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;