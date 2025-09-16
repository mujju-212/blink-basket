import React from 'react';
import { Button, Card, Table, Badge } from 'react-bootstrap';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const ProductsList = ({ onAddProduct, onEditProduct }) => {
  const products = [
    { id: 1, name: 'Fresh Apples', category: 'Fruits', price: 120, stock: 50, status: 'Active' },
    { id: 2, name: 'Organic Milk', category: 'Dairy', price: 60, stock: 25, status: 'Active' },
    { id: 3, name: 'Whole Wheat Bread', category: 'Bakery', price: 40, stock: 30, status: 'Active' }
  ];

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // Delete logic here
      console.log('Delete product:', productId);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ color: '#333', fontWeight: 'bold' }}>Products Management</h2>
          <p className="text-muted">Manage your store products</p>
        </div>
        <Button 
          style={{ backgroundColor: '#ffd60a', border: 'none', color: '#333', fontWeight: 'bold' }}
          onClick={onAddProduct}
        >
          <FaPlus className="me-2" />
          Add Product
        </Button>
      </div>

      <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={{ fontWeight: '500' }}>{product.name}</td>
                  <td>{product.category}</td>
                  <td style={{ fontWeight: 'bold', color: '#28a745' }}>₹{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <Badge 
                      bg={product.status === 'Active' ? 'success' : 'secondary'}
                      className="px-3 py-2"
                      style={{ borderRadius: '20px' }}
                    >
                      {product.status}
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
                      onClick={() => onEditProduct(product)}
                    >
                      <FaEdit />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(product.id)}
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

export default ProductsList;