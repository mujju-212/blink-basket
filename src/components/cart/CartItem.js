import React from 'react';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import QuantityStepper from './QuantityStepper';

const CartItem = ({ item }) => {
  const { removeFromCart } = useCart();

  return (
    <div className="cart-item border-bottom py-3">
      <Row className="align-items-center">
        <Col xs={3} md={2}>
          <Image 
            src={item.image} 
            alt={item.name}
            fluid
            rounded
            style={{ height: '80px', objectFit: 'cover' }}
          />
        </Col>
        
        <Col xs={6} md={6}>
          <h6 className="mb-1">{item.name}</h6>
          <p className="text-muted small mb-1">{item.size}</p>
          <p className="fw-bold text-success mb-0">₹{item.price}</p>
        </Col>
        
        <Col xs={3} md={2}>
          <QuantityStepper 
            productId={item.id}
            quantity={item.quantity}
          />
        </Col>
        
        <Col xs={12} md={2} className="text-end mt-2 mt-md-0">
          <div className="fw-bold mb-2">₹{item.price * item.quantity}</div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => removeFromCart(item.id)}
          >
            <i className="fas fa-trash"></i>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default CartItem;