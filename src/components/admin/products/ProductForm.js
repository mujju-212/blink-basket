import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import categoryService from '../../../services/categoryService';

const ProductForm = ({ show, onHide, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    unit: '',
    status: 'Active'
  });
  
  const [categories, setCategories] = useState([]);
  const units = ['kg', 'gm', 'ltr', 'ml', 'piece', 'packet'];

  // Load categories from categoryService
  useEffect(() => {
    const allCategories = categoryService.getAllCategories();
    setCategories(allCategories.map(cat => cat.name));
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        price: product.price || '',
        stock: product.stock || '',
        unit: product.unit || '',
        status: product.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        unit: '',
        status: 'Active'
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save logic here
    console.log('Save product:', formData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton style={{ backgroundColor: '#ffd60a' }}>
        <Modal.Title style={{ color: '#333', fontWeight: 'bold' }}>
          {product ? 'Edit Product' : 'Add New Product'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '500' }}>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  style={{ borderRadius: '10px' }}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '500' }}>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '10px' }}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: '500' }}>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              style={{ borderRadius: '10px' }}
            />
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '500' }}>Price (₹)</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                  style={{ borderRadius: '10px' }}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '500' }}>Stock Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  min="0"
                  style={{ borderRadius: '10px' }}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '500' }}>Unit</Form.Label>
                <Form.Select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '10px' }}
                >
                  <option value="">Select Unit</option>
                  {units.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: '500' }}>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{ borderRadius: '10px' }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button 
            type="submit"
            style={{ backgroundColor: '#ffd60a', border: 'none', color: '#333', fontWeight: 'bold' }}
          >
            {product ? 'Update Product' : 'Add Product'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProductForm;