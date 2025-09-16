import React from 'react';
import { Card, Table, Badge, Button } from 'react-bootstrap';
import { FaEye, FaEdit } from 'react-icons/fa';

const RecentOrders = () => {
  const recentOrders = [
    { id: 'BLK002', customer: 'Jane Smith', amount: 60, status: 'PENDING', date: '2024-01-16' },
    { id: 'BLK001', customer: 'John Doe', amount: 300, status: 'DELIVERED', date: '2024-01-15' }
  ];

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'PENDING':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
      <Card.Header 
        style={{ 
          backgroundColor: '#fff', 
          borderBottom: '2px solid #ffd60a', 
          borderRadius: '15px 15px 0 0' 
        }}
      >
        <h5 className="mb-0" style={{ color: '#333', fontWeight: 'bold' }}>Recent Orders</h5>
      </Card.Header>
      <Card.Body>
        <Table responsive hover>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: '500' }}>{order.id}</td>
                <td>{order.customer}</td>
                <td style={{ fontWeight: 'bold', color: '#28a745' }}>₹{order.amount}</td>
                <td>
                  <Badge 
                    bg={getStatusBadgeVariant(order.status)}
                    className="px-3 py-2"
                    style={{ borderRadius: '20px' }}
                  >
                    {order.status}
                  </Badge>
                </td>
                <td>{order.date}</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-1">
                    <FaEye />
                  </Button>
                  <Button variant="outline-warning" size="sm">
                    <FaEdit />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default RecentOrders;