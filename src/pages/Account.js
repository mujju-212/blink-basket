import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Badge, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Addresses from '../components/account/Addresses';

const Account = () => {
  const { currentUser, logout } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'orders', 'addresses', 'wishlist'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    // Load orders from localStorage
    const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    setOrders(userOrders);
  }, []);

  // Redirect to login if not authenticated
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'preparing': return 'warning';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    
    // Show notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #26a541; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <i class="fas fa-check-circle me-2"></i>
        ${product.name} moved to cart!
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  const handleRemoveFromWishlist = (productId, productName) => {
    removeFromWishlist(productId);
    
    // Show notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #dc3545; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <i class="fas fa-heart-broken me-2"></i>
        ${productName} removed from wishlist
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  const OrderTimeline = ({ timeline }) => (
    <div className="order-timeline mt-3">
      {timeline && timeline.map((step, index) => (
        <div key={index} className={`timeline-item ${step.completed ? 'completed' : ''}`}>
          <div className={`timeline-icon ${step.completed ? 'completed' : 'pending'}`}>
            <i className={`fas fa-${step.completed ? 'check' : 'clock'}`}></i>
          </div>
          <div className="flex-grow-1">
            <div className="fw-semibold">{step.status}</div>
            <div className="text-muted small">{step.time}</div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Container className="py-5">
      <Row>
        <Col md={3}>
          <Card>
            <Card.Body className="text-center">
              <div 
                className="text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ 
                  width: '80px', 
                  height: '80px',
                  backgroundColor: '#ffe01b',
                  color: '#000'
                }}
              >
                <i className="fas fa-user fa-2x"></i>
              </div>
              <h5>{currentUser?.name}</h5>
              <p className="text-muted">{currentUser?.phone}</p>
            </Card.Body>
            
            <Nav variant="pills" className="flex-column p-3">
              <Nav.Item className="mb-2">
                <Nav.Link 
                  active={activeTab === 'profile'}
                  onClick={() => handleTabChange('profile')}
                  className="d-flex align-items-center"
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fas fa-user me-2"></i>
                  My Profile
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-2">
                <Nav.Link 
                  active={activeTab === 'orders'}
                  onClick={() => handleTabChange('orders')}
                  className="d-flex align-items-center"
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fas fa-shopping-bag me-2"></i>
                  My Orders
                  {orders.length > 0 && (
                    <Badge bg="primary" className="ms-auto">{orders.length}</Badge>
                  )}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-2">
                <Nav.Link 
                  active={activeTab === 'addresses'}
                  onClick={() => handleTabChange('addresses')}
                  className="d-flex align-items-center"
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Saved Addresses
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="mb-2">
                <Nav.Link 
                  active={activeTab === 'wishlist'}
                  onClick={() => handleTabChange('wishlist')}
                  className="d-flex align-items-center"
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fas fa-heart me-2"></i>
                  Wishlist
                  {wishlist.length > 0 && (
                    <Badge bg="danger" className="ms-auto">{wishlist.length}</Badge>
                  )}
                </Nav.Link>
              </Nav.Item>
            </Nav>
            
            <Card.Footer>
              <button className="btn btn-outline-danger w-100" onClick={logout}>
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </button>
            </Card.Footer>
          </Card>
        </Col>

        <Col md={9}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-user me-2"></i>
                  My Profile
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-control" defaultValue={currentUser?.name} />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input type="tel" className="form-control" defaultValue={currentUser?.phone} />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" defaultValue={currentUser?.email} />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" className="form-control" />
                    </div>
                  </Col>
                </Row>
                <button 
                  className="btn btn-primary"
                  style={{ backgroundColor: '#ffe01b', borderColor: '#ffe01b', color: '#000' }}
                >
                  Update Profile
                </button>
              </Card.Body>
            </Card>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-shopping-bag me-2"></i>
                  My Orders
                </h5>
              </Card.Header>
              <Card.Body>
                {orders.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-shopping-bag fa-4x text-muted mb-3"></i>
                    <h5>No orders yet</h5>
                    <p className="text-muted">Your order history will appear here</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/')}
                      style={{ backgroundColor: '#ffe01b', borderColor: '#ffe01b', color: '#000' }}
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  orders.map((order) => (
                    <Card key={order.id} className="mb-4 border-2">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h6 className="mb-1">Order #{order.id}</h6>
                            <p className="text-muted small mb-0">
                              Placed on {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge bg={getStatusColor(order.status)} className="fs-6">
                            {order.status.toUpperCase()}
                          </Badge>
                        </div>

                        <Row>
                          <Col md={8}>
                            <div className="mb-3">
                              <h6>Items Ordered:</h6>
                              {order.items && order.items.map((item, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                                  <div className="d-flex align-items-center">
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                      className="rounded me-3"
                                      onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/40x40/f8f9fa/6c757d?text=Item';
                                      }}
                                    />
                                    <div>
                                      <div className="fw-semibold small">{item.name}</div>
                                      <div className="text-muted small">{item.size} × {item.quantity}</div>
                                    </div>
                                  </div>
                                  <div className="fw-semibold">₹{item.price * item.quantity}</div>
                                </div>
                              ))}
                            </div>

                            <div className="mb-3">
                              <h6>Delivery Address:</h6>
                              <p className="mb-0">
                                {order.address?.name} ({order.address?.type})<br />
                                {order.address?.address}<br />
                                {order.address?.area}, {order.address?.city} - {order.address?.pincode}<br />
                                <i className="fas fa-phone me-1"></i> {order.address?.phone}
                              </p>
                            </div>

                            <div className="mb-3">
                              <h6>Payment Method:</h6>
                              <div className="d-flex align-items-center">
                                <i className={`${order.paymentMethod?.icon} me-2`}></i>
                                {order.paymentMethod?.name}
                              </div>
                            </div>
                          </Col>

                          <Col md={4}>
                            <div className="bg-light p-3 rounded mb-3">
                              <h6>Order Summary</h6>
                              <div className="d-flex justify-content-between mb-1">
                                <span>Items ({order.items?.length || 0})</span>
                                <span>₹{order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0}</span>
                              </div>
                              <div className="d-flex justify-content-between mb-1">
                                <span>Delivery</span>
                                <span>₹29</span>
                              </div>
                              <div className="d-flex justify-content-between mb-1">
                                <span>Handling</span>
                                <span>₹5</span>
                              </div>
                              <hr />
                              <div className="d-flex justify-content-between fw-bold">
                                <span>Total</span>
                                <span className="text-success">₹{order.total}</span>
                              </div>
                            </div>

                            <div className="d-flex gap-2">
                              <button className="btn btn-outline-primary btn-sm flex-grow-1">
                                <i className="fas fa-receipt me-1"></i>
                                Invoice
                              </button>
                              {order.status === 'delivered' && (
                                <button className="btn btn-primary btn-sm flex-grow-1">
                                  <i className="fas fa-redo me-1"></i>
                                  Reorder
                                </button>
                              )}
                            </div>
                          </Col>
                        </Row>

                        {/* Order Timeline */}
                        <div className="mt-4">
                          <h6>Order Status:</h6>
                          <OrderTimeline timeline={order.timeline} />
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </Card.Body>
            </Card>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <Addresses />
          )}

          {/* Wishlist Tab - COMPLETE IMPLEMENTATION */}
          {activeTab === 'wishlist' && (
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-heart me-2 text-danger"></i>
                  My Wishlist ({wishlist.length})
                </h5>
                {wishlist.length > 0 && (
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all items from your wishlist?')) {
                        wishlist.forEach(product => removeFromWishlist(product.id));
                      }
                    }}
                  >
                    <i className="fas fa-trash me-1"></i>
                    Clear All
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                {wishlist.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-heart fa-4x text-muted mb-3"></i>
                    <h5>Your wishlist is empty</h5>
                    <p className="text-muted">Add items you love to your wishlist by clicking the heart icon on products</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/')}
                      style={{ backgroundColor: '#ffe01b', borderColor: '#ffe01b', color: '#000' }}
                    >
                      <i className="fas fa-shopping-cart me-2"></i>
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Wishlist Info */}
                    <div className="alert alert-info d-flex align-items-center mb-4">
                      <i className="fas fa-info-circle me-2"></i>
                      <div>
                        You have <strong>{wishlist.length}</strong> item{wishlist.length !== 1 ? 's' : ''} in your wishlist. 
                        Move them to cart for quick checkout!
                      </div>
                    </div>

                    {/* Wishlist Items Grid */}
                    <Row className="g-4">
                      {wishlist.map(product => {
                        const discount = product.originalPrice 
                          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                          : 0;

                        return (
                          <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                            <Card className="h-100 wishlist-item shadow-sm">
                              <div className="position-relative">
                                <Card.Img 
                                  variant="top" 
                                  src={product.image} 
                                  alt={product.name}
                                  style={{ 
                                    height: '200px', 
                                    objectFit: 'cover',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => navigate(`/product/${product.id}`)}
                                  onError={(e) => {
                                    e.target.src = `https://via.placeholder.com/200x200/f8f9fa/6c757d?text=${product.name.substring(0, 8)}`;
                                  }}
                                />
                                
                                {/* Remove from Wishlist Button */}
                                <Button
                                  variant="danger"
                                  size="sm"
                                  className="position-absolute top-0 end-0 m-2"
                                  onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                                  style={{ 
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  title="Remove from wishlist"
                                >
                                  <i className="fas fa-times"></i>
                                </Button>
                                
                                {/* Discount Badge */}
                                {discount > 0 && (
                                  <div className="position-absolute top-0 start-0 m-2">
                                    <span className="badge bg-success">
                                      {discount}% OFF
                                    </span>
                                  </div>
                                )}

                                {/* Stock Status */}
                                {product.stock === 0 && (
                                  <div 
                                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                                    style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white' }}
                                  >
                                    <span className="fw-bold">Out of Stock</span>
                                  </div>
                                )}

                                {product.stock > 0 && product.stock < 10 && (
                                  <div className="position-absolute bottom-0 start-0 m-2">
                                    <span className="badge bg-warning text-dark">
                                      Only {product.stock} left!
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <Card.Body className="d-flex flex-column">
                                <Card.Title 
                                  className="h6 mb-2" 
                                  style={{ 
                                    minHeight: '2.5rem',
                                    cursor: 'pointer'
                                  }}
                                  onClick={() => navigate(`/product/${product.id}`)}
                                >
                                  {product.name}
                                </Card.Title>
                                <Card.Text className="text-muted small mb-2">
                                  <i className="fas fa-weight me-1"></i>
                                  {product.size}
                                </Card.Text>
                                
                                {/* Price Section */}
                                <div className="d-flex align-items-center mb-3">
                                  <span className="fw-bold text-success fs-5">₹{product.price}</span>
                                  {product.originalPrice && (
                                    <span className="text-muted text-decoration-line-through ms-2">
                                      ₹{product.originalPrice}
                                    </span>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-auto d-flex flex-column gap-2">
                                  <Button 
                                    variant="primary" 
                                    onClick={() => handleMoveToCart(product)}
                                    disabled={product.stock === 0}
                                    style={{ 
                                      backgroundColor: '#ffe01b', 
                                      borderColor: '#ffe01b', 
                                      color: '#000',
                                      fontWeight: '600'
                                    }}
                                  >
                                    <i className="fas fa-shopping-cart me-2"></i>
                                    {product.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
                                  </Button>
                                  <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                  >
                                    <i className="fas fa-eye me-2"></i>
                                    View Details
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>

                    {/* Wishlist Actions */}
                    <div className="mt-4 p-3 bg-light rounded">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">Quick Actions</h6>
                          <small className="text-muted">Manage your wishlist items</small>
                        </div>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => {
                              wishlist.forEach(product => {
                                if (product.stock > 0) {
                                  addToCart(product);
                                }
                              });
                              // Clear wishlist after adding all to cart
                              wishlist.forEach(product => removeFromWishlist(product.id));
                            }}
                            disabled={wishlist.length === 0 || wishlist.every(p => p.stock === 0)}
                          >
                            <i className="fas fa-cart-plus me-1"></i>
                            Add All to Cart
                          </Button>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => navigate('/')}
                          >
                            <i className="fas fa-plus me-1"></i>
                            Add More Items
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="mt-4">
                      <h6>You might also like</h6>
                      <div className="d-flex gap-2 flex-wrap">
                        <Button variant="outline-primary" size="sm" onClick={() => navigate('/search?category=Fruits%20%26%20Vegetables')}>
                          🥬 Fruits & Vegetables
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={() => navigate('/search?category=Dairy%20%26%20Breakfast')}>
                          🥛 Dairy & Breakfast
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={() => navigate('/search?category=Snacks%20%26%20Munchies')}>
                          🍿 Snacks & Munchies
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Account;