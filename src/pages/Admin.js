import React, { useState } from 'react';
import { Container, Button, Card, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaTachometerAlt } from 'react-icons/fa';

// Import admin components
import AdminLayout from '../components/admin/layout/AdminLayout';
import Dashboard from '../components/admin/dashboard/Dashboard';
import Categories from '../components/admin/categories/Categories';
import Products from '../components/admin/products/Products';
import Offers from '../components/admin/offers/Offers';
import Banners from '../components/admin/banners/Banners';
import Users from '../components/admin/users/Users';

const Admin = () => {
  const { logout, isAdmin, currentUser, adminLogin } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

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

  // Render login form if not authenticated
  if (!isAdmin) {
    return (
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '2rem' }}>
        <Container>
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <Card className="shadow-lg border-0" style={{ borderRadius: '15px' }}>
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <div style={{ 
                      backgroundColor: '#ffd60a', 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 20px' 
                    }}>
                      <FaTachometerAlt size={40} color="#333" />
                    </div>
                    <h3 style={{ color: '#333', fontWeight: 'bold' }}>Admin Login</h3>
                    <p className="text-muted">Access admin dashboard</p>
                  </div>

                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form onSubmit={handleAdminLogin}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: '#333', fontWeight: '500' }}>Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={credentials.username}
                        onChange={(e) => setCredentials({
                          ...credentials,
                          username: e.target.value
                        })}
                        placeholder="Enter admin username"
                        required
                        style={{ borderRadius: '10px', border: '2px solid #e9ecef', padding: '12px' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label style={{ color: '#333', fontWeight: '500' }}>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({
                          ...credentials,
                          password: e.target.value
                        })}
                        placeholder="Enter admin password"
                        required
                        style={{ borderRadius: '10px', border: '2px solid #e9ecef', padding: '12px' }}
                      />
                    </Form.Group>

                    <Button 
                      type="submit" 
                      className="w-100"
                      disabled={loading}
                      style={{ 
                        backgroundColor: '#ffd60a', 
                        border: 'none', 
                        borderRadius: '10px', 
                        padding: '12px', 
                        fontWeight: 'bold',
                        color: '#333'
                      }}
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

                  <div className="mt-3 p-3" style={{ backgroundColor: '#fff3cd', borderRadius: '10px' }}>
                    <small style={{ color: '#664d03' }}>
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
                      style={{ color: '#ffd60a', fontWeight: '500' }}
                    >
                      Back to Store
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Render component based on active tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'categories':
        return <Categories />;
      case 'products':
        return <Products />;
      case 'offers':
        return <Offers />;
      case 'banners':
        return <Banners />;
      case 'users':
        return <Users />;
      default:
        return <Dashboard />;
    }
  };

  // Render admin dashboard with layout
  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderActiveComponent()}
    </AdminLayout>
  );
};

export default Admin;