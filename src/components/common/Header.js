import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Badge, Form, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import LocationModal from './LocationModal';

const Header = () => {
  const { cart, getCartItemsCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Nagawara, Bengaluru');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locations = [
            'Koramangala, Bengaluru',
            'Indiranagar, Bengaluru', 
            'Whitefield, Bengaluru',
            'HSR Layout, Bengaluru',
            'Electronic City, Bengaluru'
          ];
          
          const randomLocation = locations[Math.floor(Math.random() * locations.length)];
          setCurrentLocation(randomLocation);
          
          // Show notification
          const notification = document.createElement('div');
          notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #26a541; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
              <i class="fas fa-map-marker-alt me-2"></i>
              Location updated to ${randomLocation}
            </div>
          `;
          document.body.appendChild(notification);
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 3000);
        },
        (error) => {
          console.error('Error getting location:', error);
          setShowLocationModal(true);
        }
      );
    } else {
      setShowLocationModal(true);
    }
  };

  // Function to navigate to specific account tabs
  const navigateToAccountTab = (tab) => {
    navigate(`/account?tab=${tab}`);
  };

  return (
    <>
      <Navbar bg="white" expand="lg" className="shadow-sm border-bottom" sticky="top">
        <Container>
          {/* Logo with yellow theme */}
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-3" style={{ color: '#000' }}>
            <span 
              className="me-2 d-inline-flex align-items-center justify-content-center"
              style={{ 
                backgroundColor: '#ffe01b', 
                color: '#000',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                fontSize: '20px'
              }}
            >
              <i className="fas fa-bolt"></i>
            </span>
            blinkit
          </Navbar.Brand>

          {/* Location Selector */}
          <div className="d-none d-md-block">
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" className="border-0">
                <div className="text-start">
                  <div className="fw-semibold small">Delivery in 10 minutes</div>
                  <div className="text-muted small">
                    <i className="fas fa-map-marker-alt me-1"></i>
                    {currentLocation}
                    <i className="fas fa-chevron-down ms-1"></i>
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={detectLocation}>
                  <i className="fas fa-location-arrow me-2"></i>
                  Detect My Location
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setShowLocationModal(true)}>
                  <i className="fas fa-search me-2"></i>
                  Search Location
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>Recent Locations</Dropdown.Header>
                <Dropdown.Item onClick={() => setCurrentLocation('Koramangala, Bengaluru')}>
                  Koramangala, Bengaluru
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setCurrentLocation('Indiranagar, Bengaluru')}>
                  Indiranagar, Bengaluru
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Search Bar */}
            <Form className="d-flex mx-auto" style={{ maxWidth: '500px', width: '100%' }} onSubmit={handleSearch}>
              <div className="position-relative w-100">
                <Form.Control
                  type="search"
                  placeholder="Search for groceries, snacks & more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pe-5"
                  style={{ borderRadius: '25px' }}
                />
                <Button
                  variant="link"
                  type="submit"
                  className="position-absolute end-0 top-50 translate-middle-y border-0"
                  style={{ zIndex: 5 }}
                >
                  <i className="fas fa-search text-muted"></i>
                </Button>
              </div>
            </Form>

            {/* Navigation Items */}
            <Nav className="ms-auto align-items-center">
              {/* Quick Categories */}
              <Dropdown className="d-none d-lg-block me-3">
                <Dropdown.Toggle 
                  variant="outline-secondary" 
                  size="sm"
                  style={{ borderColor: '#ffe01b', color: '#000' }}
                >
                  <i className="fas fa-th-large me-1"></i>
                  Categories
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => navigate('/search?category=Fruits%20%26%20Vegetables')}>
                    🥬 Fruits & Vegetables
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate('/search?category=Dairy%20%26%20Breakfast')}>
                    🥛 Dairy & Breakfast
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate('/search?category=Beverages')}>
                    🥤 Beverages
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate('/search?category=Snacks%20%26%20Munchies')}>
                    🍿 Snacks & Munchies
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate('/search?category=Personal%20Care')}>
                    🧴 Personal Care
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate('/search?category=Home%20Care')}>
                    🧽 Home Care
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* User Account */}
              {user ? (
                <Dropdown className="me-3">
                  <Dropdown.Toggle variant="outline-secondary" className="border-0">
                    <i className="fas fa-user me-1"></i>
                    {user.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    {/* Account - Goes to Profile tab */}
                    <Dropdown.Item onClick={() => navigateToAccountTab('profile')}>
                      <i className="fas fa-user me-2"></i>
                      My Account
                    </Dropdown.Item>
                    
                    {/* Orders - Goes to Orders tab */}
                    <Dropdown.Item onClick={() => navigateToAccountTab('orders')}>
                      <i className="fas fa-shopping-bag me-2"></i>
                      My Orders
                    </Dropdown.Item>
                    
                    {/* Wishlist - Goes to Wishlist tab */}
                    <Dropdown.Item onClick={() => navigateToAccountTab('wishlist')}>
                      <i className="fas fa-heart me-2"></i>
                      Wishlist
                    </Dropdown.Item>
                    
                    {/* Addresses - Goes to Addresses tab */}
                    <Dropdown.Item onClick={() => navigateToAccountTab('addresses')}>
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Addresses
                    </Dropdown.Item>
                    
                    <Dropdown.Divider />
                    
                    {/* Logout */}
                    <Dropdown.Item onClick={logout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button 
                  variant="outline-secondary" 
                  className="me-3" 
                  onClick={() => navigate('/login')}
                  style={{ borderColor: '#ffe01b', color: '#000' }}
                >
                  <i className="fas fa-user me-1"></i>
                  Login
                </Button>
              )}

              {/* Cart */}
              <Button
                className="position-relative"
                onClick={() => navigate('/cart')}
                style={{ 
                  backgroundColor: '#ffe01b', 
                  borderColor: '#ffe01b', 
                  color: '#000',
                  fontWeight: '600'
                }}
              >
                <i className="fas fa-shopping-cart me-1"></i>
                Cart
                {getCartItemsCount() > 0 && (
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle rounded-pill"
                    style={{ fontSize: '0.7rem' }}
                  >
                    {getCartItemsCount()}
                  </Badge>
                )}
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Location Bar */}
      <div className="d-md-none bg-light border-bottom p-2">
        <Container>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center" onClick={() => setShowLocationModal(true)}>
              <i className="fas fa-map-marker-alt text-warning me-2"></i>
              <div>
                <div className="small fw-semibold">Delivery in 10 min</div>
                <div className="small text-muted">{currentLocation}</div>
              </div>
              <i className="fas fa-chevron-down ms-2 text-muted"></i>
            </div>
            <Button 
              variant="outline-warning" 
              size="sm" 
              onClick={detectLocation}
              style={{ borderColor: '#ffe01b', color: '#000' }}
            >
              <i className="fas fa-location-arrow"></i>
            </Button>
          </div>
        </Container>
      </div>

      <LocationModal
        show={showLocationModal}
        onHide={() => setShowLocationModal(false)}
        onLocationSelect={setCurrentLocation}
        currentLocation={currentLocation}
      />
    </>
  );
};

export default Header;