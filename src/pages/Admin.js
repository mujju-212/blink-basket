import React, { useState } from 'react';
import { Container, Button, Card, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { logout, isAdmin, currentUser, adminLogin } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = adminLogin(credentials.username, credentials.password);
      if (!success) {
        setError('Invalid admin credentials. Use username: admin, password: admin123');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAdmin) {
    return (
      <Container className="py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <Card>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h3>Admin Login</h3>
                  <p className="text-muted">Access admin dashboard</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleAdminLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={credentials.username}
                      onChange={(e) => setCredentials({
                        ...credentials,
                        username: e.target.value
                      })}
                      placeholder="Enter admin username"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({
                        ...credentials,
                        password: e.target.value
                      })}
                      placeholder="Enter admin password"
                      required
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Logging in...
                      </>
                    ) : (
                      'Login as Admin'
                    )}
                  </Button>
                </Form>

                <div className="mt-3 p-3 bg-light rounded">
                  <small className="text-muted">
                    <strong>Demo Credentials:</strong><br/>
                    Username: <code>admin</code><br/>
                    Password: <code>admin123</code>
                  </small>
                </div>

                <div className="text-center mt-3">
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/')}
                    className="text-decoration-none"
                  >
                    Back to Store
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    );
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