import React from 'react';
import { Button, Card, Table, Badge } from 'react-bootstrap';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const Offers = () => {
  const offers = [
    { id: 1, title: 'Weekend Special', discount: '20%', category: 'Fruits', validity: '2024-12-31', status: 'Active' },
    { id: 2, title: 'Buy 2 Get 1', discount: '33%', category: 'Dairy', validity: '2024-12-25', status: 'Active' }
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ color: '#333', fontWeight: 'bold' }}>Offers Management</h2>
          <p className="text-muted">Manage promotional offers</p>
        </div>
        <Button 
          style={{ backgroundColor: '#ffd60a', border: 'none', color: '#333', fontWeight: 'bold' }}
        >
          <FaPlus className="me-2" />
          Add Offer
        </Button>
      </div>

      <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th>Offer Title</th>
                <th>Discount</th>
                <th>Category</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id}>
                  <td style={{ fontWeight: '500' }}>{offer.title}</td>
                  <td style={{ fontWeight: 'bold', color: '#dc3545' }}>{offer.discount}</td>
                  <td>{offer.category}</td>
                  <td>{offer.validity}</td>
                  <td>
                    <Badge 
                      bg={offer.status === 'Active' ? 'success' : 'secondary'}
                      className="px-3 py-2"
                      style={{ borderRadius: '20px' }}
                    >
                      {offer.status}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-1">
                      <FaEye />
                    </Button>
                    <Button variant="outline-warning" size="sm" className="me-1">
                      <FaEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm">
                      <FaTrash />
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

export default Offers;