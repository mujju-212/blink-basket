import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal, Form, Row, Col, Alert, Dropdown } from 'react-bootstrap';
import { FaEye, FaEdit, FaCheck, FaTruck, FaBox, FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';
import orderService from '../../services/orderService';
import OrderTimeline from '../order/OrderTimeline';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const ordersData = orderService.getAllOrders();
    setOrders(ordersData.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaEdit />;
      case 'confirmed': return <FaCheck />;
      case 'preparing': return <FaBox />;
      case 'out_for_delivery': return <FaTruck />;
      case 'delivered': return <FaCheck />;
      case 'cancelled': return <FaTimes />;
      default: return <FaEdit />;
    }
  };

  const getStatusActions = (order) => {
    const actions = [];
    
    switch (order.status) {
      case 'pending':
        actions.push(
          { label: 'Confirm Order', status: 'confirmed', variant: 'success', icon: <FaCheck /> },
          { label: 'Cancel Order', status: 'cancelled', variant: 'danger', icon: <FaTimes /> }
        );
        break;
      case 'confirmed':
        actions.push(
          { label: 'Start Preparing', status: 'preparing', variant: 'primary', icon: <FaBox /> },
          { label: 'Cancel Order', status: 'cancelled', variant: 'danger', icon: <FaTimes /> }
        );
        break;
      case 'preparing':
        actions.push(
          { label: 'Out for Delivery', status: 'out_for_delivery', variant: 'info', icon: <FaTruck /> }
        );
        break;
      case 'out_for_delivery':
        actions.push(
          { label: 'Mark Delivered', status: 'delivered', variant: 'success', icon: <FaCheck /> }
        );
        break;
      default:
        return null;
    }
    
    return actions;
  };

  const handleStatusChange = (orderId, newStatus) => {
    orderService.updateOrderStatus(orderId, newStatus);
    loadOrders();
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Order Management</h5>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className="fw-semibold">{order.id}</div>
                  </td>
                  <td>
                    <div>
                      <div className="fw-semibold">{order.customer}</div>
                      <small className="text-muted">{order.phone}</small>
                    </div>
                  </td>
                  <td>
                    <Badge bg="info">{order.items.length} items</Badge>
                  </td>
                  <td>
                    <div className="fw-semibold text-success">₹{order.total}</div>
                  </td>
                  <td>
                    <Badge 
                      bg={getStatusVariant(order.status)} 
                      className="d-flex align-items-center gap-1"
                      style={{ fontSize: '11px', padding: '5px 8px' }}
                    >
                      {getStatusIcon(order.status)}
                      {order.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td>
                    <div>{order.date}</div>
                    <small className="text-muted">{order.timeline[0]?.time}</small>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                        title="View Details"
                      >
                        <FaEye />
                      </Button>
                      
                      {getStatusActions(order) && (
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-success" size="sm">
                            Actions
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {getStatusActions(order).map((action, index) => (
                              <Dropdown.Item
                                key={index}
                                onClick={() => handleStatusChange(order.id, action.status)}
                                className={`text-${action.variant}`}
                              >
                                {action.icon} {action.label}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-4">
              <i className="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
              <h5>No orders found</h5>
              <p className="text-muted">
                {filterStatus === 'all' ? 'No orders have been placed yet' : `No ${filterStatus} orders found`}
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Enhanced Order Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton style={{ backgroundColor: '#ffd60a', borderBottom: '2px solid #ffcd00' }}>
          <Modal.Title className="d-flex align-items-center gap-2">
            <FaEye /> Order Details - {selectedOrder?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              {/* Status Alert */}
              <Alert 
                variant={getStatusVariant(selectedOrder.status)} 
                className="d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center gap-2">
                  {getStatusIcon(selectedOrder.status)}
                  <strong>Current Status: {selectedOrder.status.replace('_', ' ').toUpperCase()}</strong>
                </div>
                <div>
                  {getStatusActions(selectedOrder) && (
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-dark" size="sm">
                        Update Status
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {getStatusActions(selectedOrder).map((action, index) => (
                          <Dropdown.Item
                            key={index}
                            onClick={() => {
                              handleStatusChange(selectedOrder.id, action.status);
                              setSelectedOrder({...selectedOrder, status: action.status});
                            }}
                            className={`text-${action.variant}`}
                          >
                            {action.icon} {action.label}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </div>
              </Alert>

              <Row className="mb-4">
                {/* Customer Information */}
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0"><FaEnvelope className="me-2" />Customer Information</h6>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Name:</strong> {selectedOrder.customer}</p>
                      <p><strong><FaPhone className="me-1" />Phone:</strong> {selectedOrder.phone}</p>
                      <p><strong><FaEnvelope className="me-1" />Email:</strong> {selectedOrder.email}</p>
                      <p><strong>Order Date:</strong> {selectedOrder.date}</p>
                      <p><strong>Order Time:</strong> {selectedOrder.timeline[0]?.time}</p>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Delivery & Payment Information */}
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0"><FaMapMarkerAlt className="me-2" />Delivery & Payment</h6>
                    </Card.Header>
                    <Card.Body>
                      <p><strong><FaMapMarkerAlt className="me-1" />Address:</strong><br />
                        <small>{selectedOrder.address}</small>
                      </p>
                      <p><strong><FaCreditCard className="me-1" />Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                      <p><strong>Payment Status:</strong> 
                        <Badge 
                          bg={selectedOrder.paymentStatus === 'Completed' ? 'success' : 
                              selectedOrder.paymentStatus === 'Pending' ? 'warning' : 'danger'}
                          className="ms-1"
                        >
                          {selectedOrder.paymentStatus}
                        </Badge>
                      </p>
                      <p><strong>Delivery Fee:</strong> ₹{selectedOrder.deliveryFee}</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Order Items */}
              <Card className="mb-4">
                <Card.Header className="bg-light">
                  <h6 className="mb-0"><FaBox className="me-2" />Order Items ({selectedOrder.items.length} items)</h6>
                </Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead className="table-light">
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                <div 
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <FaBox />
                                </div>
                              </div>
                              <div>
                                <div className="fw-semibold">{item.name}</div>
                                <small className="text-muted">ID: {item.id}</small>
                              </div>
                            </div>
                          </td>
                          <td className="align-middle">
                            <Badge bg="secondary">{item.quantity}</Badge>
                          </td>
                          <td className="align-middle">₹{item.price}</td>
                          <td className="align-middle">
                            <strong>₹{item.price * item.quantity}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-light">
                      <tr>
                        <th colSpan="3">Subtotal</th>
                        <th>₹{selectedOrder.total - selectedOrder.deliveryFee}</th>
                      </tr>
                      <tr>
                        <th colSpan="3">Delivery Fee</th>
                        <th>₹{selectedOrder.deliveryFee}</th>
                      </tr>
                      <tr className="table-warning">
                        <th colSpan="3">Total Amount</th>
                        <th>₹{selectedOrder.total}</th>
                      </tr>
                    </tfoot>
                  </Table>
                </Card.Body>
              </Card>

              {/* Order Timeline */}
              <Card>
                <Card.Header className="bg-light">
                  <h6 className="mb-0"><FaTruck className="me-2" />Order Timeline</h6>
                </Card.Header>
                <Card.Body>
                  <OrderTimeline 
                    timeline={selectedOrder.timeline} 
                    currentStatus={selectedOrder.status} 
                  />
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <div>
              {selectedOrder && getStatusActions(selectedOrder) && (
                <div className="d-flex gap-2">
                  {getStatusActions(selectedOrder).map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant}
                      size="sm"
                      onClick={() => {
                        handleStatusChange(selectedOrder.id, action.status);
                        setSelectedOrder({...selectedOrder, status: action.status});
                      }}
                    >
                      {action.icon} {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderManagement;