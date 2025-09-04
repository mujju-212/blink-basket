import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal, Form, InputGroup } from 'react-bootstrap';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const loadUsers = () => {
    // Mock user data - in real app, this would come from an API
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        orders: 5,
        totalSpent: 2500,
        joined: '2024-01-01',
        status: 'active',
        lastOrder: '2024-01-15'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+91 9876543211',
        orders: 3,
        totalSpent: 1800,
        joined: '2024-01-05',
        status: 'active',
        lastOrder: '2024-01-10'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+91 9876543212',
        orders: 8,
        totalSpent: 4200,
        joined: '2023-12-15',
        status: 'active',
        lastOrder: '2024-01-12'
      },
      {
        id: 4,
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+91 9876543213',
        orders: 1,
        totalSpent: 350,
        joined: '2024-01-10',
        status: 'inactive',
        lastOrder: '2024-01-10'
      }
    ];

    setUsers(mockUsers);
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const getStatusVariant = (status) => {
    return status === 'active' ? 'success' : 'secondary';
  };

  const getUserTier = (totalSpent) => {
    if (totalSpent >= 5000) return { tier: 'Gold', variant: 'warning' };
    if (totalSpent >= 2000) return { tier: 'Silver', variant: 'info' };
    return { tier: 'Bronze', variant: 'secondary' };
  };

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">User Management</h5>
          <div style={{ width: '300px' }}>
            <InputGroup>
              <InputGroup.Text>
                <i className="fas fa-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Tier</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const tierInfo = getUserTier(user.totalSpent);
                return (
                  <tr key={user.id}>
                    <td>
                      <div>
                        <div className="fw-semibold">{user.name}</div>
                        <small className="text-muted">ID: {user.id}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="small">{user.email}</div>
                        <div className="small text-muted">{user.phone}</div>
                      </div>
                    </td>
                    <td>
                      <Badge bg="info">{user.orders}</Badge>
                    </td>
                    <td>
                      <div className="fw-semibold text-success">₹{user.totalSpent.toLocaleString()}</div>
                    </td>
                    <td>
                      <Badge bg={tierInfo.variant}>{tierInfo.tier}</Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(user.status)}>
                        {user.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <div className="small">{user.joined}</div>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewUser(user)}
                      >
                        <i className="fas fa-eye"></i>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-4">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
              <h5>No users found</h5>
              <p className="text-muted">
                {searchTerm ? `No users match "${searchTerm}"` : 'No users registered yet'}
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* User Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h6>Personal Information</h6>
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Phone:</strong> {selectedUser.phone}</p>
                  <p><strong>Member Since:</strong> {selectedUser.joined}</p>
                </div>
                <div className="col-md-6">
                  <h6>Account Statistics</h6>
                  <p><strong>Total Orders:</strong> {selectedUser.orders}</p>
                  <p><strong>Total Spent:</strong> ₹{selectedUser.totalSpent.toLocaleString()}</p>
                  <p><strong>Last Order:</strong> {selectedUser.lastOrder}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Badge bg={getStatusVariant(selectedUser.status)}>
                      {selectedUser.status.toUpperCase()}
                    </Badge>
                  </p>
                  <p>
                    <strong>Tier:</strong>{' '}
                    <Badge bg={getUserTier(selectedUser.totalSpent).variant}>
                      {getUserTier(selectedUser.totalSpent).tier}
                    </Badge>
                  </p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="mb-4">
                <h6>Recent Orders</h6>
                <Table size="sm">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mock recent orders */}
                    <tr>
                      <td>BLK001</td>
                      <td>2024-01-15</td>
                      <td>₹450</td>
                      <td><Badge bg="success">Delivered</Badge></td>
                    </tr>
                    <tr>
                      <td>BLK002</td>
                      <td>2024-01-12</td>
                      <td>₹320</td>
                      <td><Badge bg="success">Delivered</Badge></td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              {/* User Actions */}
              <div className="d-flex gap-2">
                <Button variant="outline-primary" size="sm">
                  <i className="fas fa-envelope me-1"></i>
                  Send Email
                </Button>
                <Button variant="outline-warning" size="sm">
                  <i className="fas fa-ban me-1"></i>
                  Suspend Account
                </Button>
                <Button variant="outline-info" size="sm">
                  <i className="fas fa-gift me-1"></i>
                  Send Coupon
                </Button>
              </div>
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

export default UserManagement;