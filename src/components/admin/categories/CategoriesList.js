import React from 'react';
import { Button, Card, Table, Badge } from 'react-bootstrap';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const CategoriesList = ({ onAddCategory, onEditCategory }) => {
  const categories = [
    { id: 1, name: 'Fruits & Vegetables', products: 15, status: 'Active' },
    { id: 2, name: 'Dairy Products', products: 8, status: 'Active' },
    { id: 3, name: 'Bakery Items', products: 12, status: 'Active' }
  ];

  const handleDelete = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      // Delete logic here
      console.log('Delete category:', categoryId);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ color: '#333', fontWeight: 'bold' }}>Categories Management</h2>
          <p className="text-muted">Manage product categories</p>
        </div>
        <Button 
          style={{ backgroundColor: '#ffd60a', border: 'none', color: '#333', fontWeight: 'bold' }}
          onClick={onAddCategory}
        >
          <FaPlus className="me-2" />
          Add Category
        </Button>
      </div>

      <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th>Category Name</th>
                <th>Products Count</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td style={{ fontWeight: '500' }}>{category.name}</td>
                  <td>{category.products}</td>
                  <td>
                    <Badge 
                      bg={category.status === 'Active' ? 'success' : 'secondary'}
                      className="px-3 py-2"
                      style={{ borderRadius: '20px' }}
                    >
                      {category.status}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-1">
                      <FaEye />
                    </Button>
                    <Button 
                      variant="outline-warning" 
                      size="sm" 
                      className="me-1"
                      onClick={() => onEditCategory(category)}
                    >
                      <FaEdit />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                    >
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

export default CategoriesList;