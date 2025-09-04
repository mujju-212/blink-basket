import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { orderService } from '../../services/orderService';
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
      case 'processing': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
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
            <option value="processing">Processing</option>
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
                    <Form.Select
                      size="sm"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{ width: '120px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </td>
                  <td>
                    <div>{order.date}</div>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
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

      {/* Order Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              {/* Order Info */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <h6>Order Information</h6>
                  <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                  <p><strong>Customer:</strong> {selectedOrder.customer}</p>
                  <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                  <p><strong>Date:</strong> {selectedOrder.date}</p>
                </div>
                <div className="col-md-6">
                  <h6>Delivery Information</h6>
                  <p><strong>Address:</strong> {selectedOrder.address}</p>
                  <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Badge bg={getStatusVariant(selectedOrder.status)}>
                      {selectedOrder.status.toUpperCase()}
                    </Badge>
                                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h6>Order Items</h6>
                <Table size="sm">
                  <thead>
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
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.price}</td>
                        <td>₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan="3">Total Amount</th>
                      <th>₹{selectedOrder.total}</th>
                    </tr>
                  </tfoot>
                </Table>
              </div>

              {/* Order Timeline */}
              <OrderTimeline 
                timeline={selectedOrder.timeline} 
                currentStatus={selectedOrder.status} 
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderManagement;