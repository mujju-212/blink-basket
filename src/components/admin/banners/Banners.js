import React from 'react';
import { Button, Card, Table, Badge } from 'react-bootstrap';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const Banners = () => {
  const banners = [
    { id: 1, title: 'Fresh Fruits Sale', image: 'banner1.jpg', position: 'Hero', status: 'Active' },
    { id: 2, title: 'Grocery Deals', image: 'banner2.jpg', position: 'Middle', status: 'Active' }
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ color: '#333', fontWeight: 'bold' }}>Banners Management</h2>
          <p className="text-muted">Manage promotional banners</p>
        </div>
        <Button 
          style={{ backgroundColor: '#ffd60a', border: 'none', color: '#333', fontWeight: 'bold' }}
        >
          <FaPlus className="me-2" />
          Add Banner
        </Button>
      </div>

      <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th>Banner Title</th>
                <th>Image</th>
                <th>Position</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner.id}>
                  <td style={{ fontWeight: '500' }}>{banner.title}</td>
                  <td>{banner.image}</td>
                  <td>{banner.position}</td>
                  <td>
                    <Badge 
                      bg={banner.status === 'Active' ? 'success' : 'secondary'}
                      className="px-3 py-2"
                      style={{ borderRadius: '20px' }}
                    >
                      {banner.status}
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

export default Banners;