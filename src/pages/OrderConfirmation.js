import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import orderService from '../services/orderService';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = () => {
      try {
        const orderData = orderService.getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>Order not found</h4>
          <p>The order you're looking for doesn't exist.</p>
          <Button as={Link} to="/" variant="primary">Go Home</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="text-center mb-4">
            <div className="text-success mb-3">
              <i className="fas fa-check-circle fa-4x"></i>
            </div>
            <h2 className="text-success">Order Placed Successfully!</h2>
            <p className="text-muted">Thank you for your order. We'll deliver it in 10-15 minutes.</p>
          </div>

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Order Details</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Order ID:</strong> {order.id}</p>
                  <p><strong>Customer:</strong> {order.customer}</p>
                  <p><strong>Phone:</strong> {order.phone}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Order Date:</strong> {order.date}</p>
                  <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                  <p><strong>Total Amount:</strong> <span className="text-success fw-bold">₹{order.total}</span></p>
                </Col>
              </Row>
              
              <hr />
              
              <h6>Delivery Address:</h6>
              <p className="text-muted">{order.address}</p>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Order Items</h5>
            </Card.Header>
            <Card.Body>
              {order.items.map((item, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-2">
                  <div>
                    <h6 className="mb-0">{item.name}</h6>
                    <small className="text-muted">Quantity: {item.quantity}</small>
                  </div>
                  <div className="fw-bold">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Timeline</h5>
            </Card.Header>
            <Card.Body>
              <div className="timeline">
                {order.timeline.map((step, index) => (
                  <div key={index} className="d-flex align-items-center mb-3">
                    <div 
                      className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
                        step.completed ? 'bg-success text-white' : 'bg-light text-muted'
                      }`}
                      style={{ width: '40px', height: '40px' }}
                    >
                      <i className={`fas fa-${step.completed ? 'check' : 'clock'}`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-0">{step.status}</h6>
                      <small className="text-muted">{step.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <div className="text-center mt-4">
            <Button as={Link} to="/" variant="primary" className="me-3">
              Continue Shopping
            </Button>
            <Button as={Link} to="/account?tab=orders" variant="outline-primary">
              View All Orders
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderConfirmation;