import React from 'react';
import { Card, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AccountSidebar = ({ activeTab, setActiveTab }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Card>
      <Card.Body className="text-center">
        <div 
          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
          style={{ width: '80px', height: '80px' }}
        >
          <i className="fas fa-user fa-2x"></i>
        </div>
        <h5>{currentUser?.name}</h5>
        <p className="text-muted">{currentUser?.phone}</p>
      </Card.Body>
      
      <Nav variant="pills" className="flex-column">
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            className="d-flex align-items-center"
          >
            <i className="fas fa-user me-2"></i>
            My Profile
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'orders'}
            onClick={() => setActiveTab('orders')}
            className="d-flex align-items-center"
          >
            <i className="fas fa-shopping-bag me-2"></i>
            My Orders
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'addresses'}
            onClick={() => setActiveTab('addresses')}
            className="d-flex align-items-center"
          >
            <i className="fas fa-map-marker-alt me-2"></i>
            Saved Addresses
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={activeTab === 'wishlist'}
            onClick={() => setActiveTab('wishlist')}
            className="d-flex align-items-center"
          >
            <i className="fas fa-heart me-2"></i>
            Wishlist
          </Nav.Link>
        </Nav.Item>
      </Nav>
      
      <Card.Footer>
        <Button variant="outline-danger" className="w-100" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt me-2"></i>
          Logout
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default AccountSidebar;