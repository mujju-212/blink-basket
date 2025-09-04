// src/pages/Cart.js
import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';

const Cart = () => {
  const { cart, getCartTotal, getCartItemsCount } = useCart();
  const { user, currentUser } = useAuth();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const deliveryFee = subtotal >= 99 ? 0 : 29;
  const handlingFee = 5;
  const total = subtotal + deliveryFee + handlingFee;

  const handleProceedToCheckout = () => {
    if (!user && !currentUser) {
      // Save current location and redirect to login
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
          <h3>Your cart is empty</h3>
          <p className="text-muted mb-4">Add some items to get started</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/')}
            style={{ backgroundColor: '#ffe01b', borderColor: '#ffe01b', color: '#000' }}
          >
            <i className="fas fa-shopping-cart me-2"></i>
            Start Shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-shopping-cart me-2"></i>
                Shopping Cart ({getCartItemsCount()} items)
              </h5>
            </Card.Header>
            <Card.Body>
              {cart.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="sticky-top" style={{ top: '100px' }}>
            <Card.Header>
              <h6 className="mb-0">Order Summary</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({getCartItemsCount()} items)</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Handling Fee</span>
                <span>₹{handlingFee}</span>
              </div>
              
              {subtotal < 99 && (
                <Alert variant="info" className="small py-2 mt-3">
                  <i className="fas fa-info-circle me-1"></i>
                  Add ₹{99 - subtotal} more for FREE delivery!
                </Alert>
              )}
              
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span className="text-success">₹{total}</span>
              </div>
              
              <Button 
                variant="primary" 
                className="w-100 mt-3"
                onClick={handleProceedToCheckout}
                style={{ backgroundColor: '#ffe01b', borderColor: '#ffe01b', color: '#000', fontWeight: '600' }}
              >
                <i className="fas fa-credit-card me-2"></i>
                Proceed to Checkout
              </Button>
              
              <div className="text-center mt-3">
                <small className="text-muted">
                  <i className="fas fa-shield-alt me-1"></i>
                  Safe and secure checkout
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;