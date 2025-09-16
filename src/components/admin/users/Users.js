import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { FaEye, FaEdit } from 'react-icons/fa';

const Users = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '9876543210', orders: 5, joined: '2024-01-10' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '9876543211', orders: 3, joined: '2024-01-12' }
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 style={{ color: '#333', fontWeight: 'bold' }}>Users Management</h2>
        <p className="text-muted">Manage registered users</p>
      </div>

      <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th>User Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ fontWeight: '500' }}>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.orders}</td>
                  <td>{user.joined}</td>
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
    </div>
  );
};

export default Users;