import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { logout, isAdmin, currentUser } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/login?admin=true');
    }
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      {/* Admin Header */}
      <div className="bg-dark text-white py-4">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-0">Admin Dashboard</h2>
              <p className="mb-0">Welcome, {currentUser?.name}</p>
            </div>
            <div className="d-flex gap-3">
              <Button variant="outline-light" onClick={() => navigate('/')}>
                <i className="fas fa-home me-2"></i>
                View Store
              </Button>
              <Button variant="outline-light" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Admin Content */}
      <Container className="py-4">
        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="card text-center">
              <div className="card-body">
                <h3 className="text-primary">156</h3>
                <p>Total Orders</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card text-center">
              <div className="card-body">
                <h3 className="text-success">100</h3>
                <p>Total Products</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card text-center">
              <div className="card-body">
                <h3 className="text-info">1,234</h3>
                <p>Total Users</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card text-center">
              <div className="card-body">
                <h3 className="text-warning">₹45,678</h3>
                <p>Total Revenue</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5>Admin Features</h5>
          </div>
          <div className="card-body">
            <p>Admin dashboard is working! You can now:</p>
            <ul>
              <li>View statistics</li>
              <li>Manage products</li>
              <li>Handle orders</li>
              <li>Manage users</li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Admin;