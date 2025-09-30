import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';

const Orders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = () => {
      try {
        const userOrders = orderService.getUserOrders(currentUser?.phone);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [currentUser]);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'preparing': return 'primary';
      case 'out_for_delivery': return 'secondary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusDisplay = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <i className="fas fa-shopping-bag fa-4x text-muted mb-3"></i>
          <h5>No orders yet</h5>
          <p className="text-muted">Your order history will appear here</p>
          <Button variant="primary" href="/">Start Shopping</Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <Card.Header>
          <h5 className="mb-0">My Orders</h5>
        </Card.Header>
        <Card.Body>
          {orders.map((order) => (
            <Card key={order.id} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h6>Order #{order.id}</h6>
                    <p className="text-muted mb-0">Placed on {order.date}</p>
                  </div>
                  <Badge bg={getStatusVariant(order.status)}>
                    {getStatusDisplay(order.status)}
                  </Badge>
                </div>

                <div className="mb-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="d-flex justify-content-between small">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="fw-bold">Total: ₹{order.total}</div>
                  <div>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      View Details
                    </Button>
                    {order.status === 'delivered' && (
                      <Button variant="primary" size="sm" className="ms-2">
                        Reorder
                      </Button>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </Card.Body>
      </Card>

      {/* Order Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <div className="mb-4">
                <h6>Order #{selectedOrder.id}</h6>
                                <p className="text-muted">Placed on {selectedOrder.date} by {selectedOrder.customer}</p>
                <p className="text-muted">Phone: {selectedOrder.phone}</p>
                <p className="text-muted">Address: {selectedOrder.address}</p>
                <Badge bg={getStatusVariant(selectedOrder.status)}>
                  {getStatusDisplay(selectedOrder.status)}
                </Badge>
              </div>

              <div className="mb-4">
                <h6>Order Items</h6>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between border-bottom py-2">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="d-flex justify-content-between fw-bold pt-2">
                  <span>Total</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>

              <div>
                <h6>Order Timeline</h6>
                <div className="timeline">
                  {selectedOrder.timeline.map((step, index) => (
                    <div key={index} className="d-flex align-items-center mb-3">
                      <div 
                        className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
                          step.completed ? 'bg-success text-white' : 'bg-light text-muted'
                        }`}
                        style={{ width: '30px', height: '30px' }}
                      >
                        <i className={`fas fa-${step.completed ? 'check' : 'clock'} fa-sm`}></i>
                      </div>
                      <div>
                        <div className="fw-semibold">{step.status}</div>
                        <small className="text-muted">{step.time}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Orders;