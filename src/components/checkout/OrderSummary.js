import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';

const OrderSummary = ({ deliveryFee = 29, handlingFee = 5, discount = 0 }) => {
  const { cart, getCartTotal } = useCart();
  
  const subtotal = getCartTotal();
  const actualDeliveryFee = subtotal >= 99 ? 0 : deliveryFee;
  const total = subtotal + actualDeliveryFee + handlingFee - discount;

  return (
    <Card className="sticky-top" style={{ top: '100px' }}>
      <Card.Header>
        <h5 className="mb-0">Order Summary</h5>
      </Card.Header>
      <Card.Body>
        {/* Order Items */}
        <div className="order-items mb-3">
          {cart.map((item) => (
            <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded me-2"
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                />
                <div>
                  <div className="small fw-semibold">{item.name}</div>
                  <div className="text-muted small">Qty: {item.quantity}</div>
                </div>
              </div>
              <div className="fw-semibold">₹{item.price * item.quantity}</div>
            </div>
          ))}
        </div>

        <hr />

        {/* Price Breakdown */}
        <div className="price-breakdown">
          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal ({cart.length} items)</span>
            <span>₹{subtotal}</span>
          </div>
          
          <div className="d-flex justify-content-between mb-2">
            <span>Delivery Fee</span>
            <span>
              {actualDeliveryFee === 0 ? (
                <span className="text-success">FREE</span>
              ) : (
                `₹${actualDeliveryFee}`
              )}
            </span>
          </div>
          
          <div className="d-flex justify-content-between mb-2">
            <span>Handling Fee</span>
            <span>₹{handlingFee}</span>
          </div>
          
          {discount > 0 && (
            <div className="d-flex justify-content-between mb-2">
              <span>Discount</span>
              <span className="text-success">-₹{discount}</span>
            </div>
          )}

          {subtotal < 99 && (
            <div className="alert alert-info small mt-2 mb-2">
              <i className="fas fa-info-circle me-1"></i>
              Add ₹{99 - subtotal} more for free delivery!
            </div>
          )}

          <hr />

          <div className="d-flex justify-content-between fw-bold fs-5">
            <span>Total</span>
            <span className="text-success">₹{total}</span>
          </div>
        </div>

        {/* Savings Badge */}
        {discount > 0 && (
          <div className="text-center mt-3">
            <Badge bg="success" className="px-3 py-2">
              <i className="fas fa-tag me-1"></i>
              You saved ₹{discount}!
            </Badge>
          </div>
        )}

        {/* Delivery Info */}
        <div className="delivery-info mt-3 p-3 bg-light rounded">
          <div className="d-flex align-items-center text-success mb-2">
            <i className="fas fa-clock me-2"></i>
            <span className="fw-semibold">Delivery in 10-15 minutes</span>
          </div>
          <div className="small text-muted">
            <i className="fas fa-shield-alt me-1"></i>
            Safe and contactless delivery
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderSummary;