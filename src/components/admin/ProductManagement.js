import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Alert, Badge, InputGroup } from 'react-bootstrap';
import productService from '../../services/productService';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    size: '',
    stock: '',
    image: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filterCategory]);

  const loadData = () => {
    const productsData = productService.getAllProducts();
    const categoriesData = productService.getAllCategories();
    setProducts(productsData);
    setCategories(categoriesData);
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.category === filterCategory);
    }

    setFilteredProducts(filtered);
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categories[0]?.name || '',
      price: '',
      originalPrice: '',
      size: '',
      stock: '',
      image: '',
      description: ''
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      size: product.size,
      stock: product.stock.toString(),
      image: product.image,
      description: product.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        productService.deleteProduct(productId);
        loadData();
        showAlert('Product deleted successfully!');
      } catch (error) {
        showAlert('Error deleting product', 'danger');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        productService.updateProduct(editingProduct.id, productData);
        showAlert('Product updated successfully!');
      } else {
        productService.addProduct(productData);
        showAlert('Product added successfully!');
      }
      
      setShowModal(false);
      loadData();
    } catch (error) {
      showAlert('Error saving product', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', variant: 'danger' };
    if (stock <= 5) return { text: 'Low Stock', variant: 'warning' };
    return { text: 'In Stock', variant: 'success' };
  };

  return (
    <>
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Product Management</h5>
            <Button variant="primary" onClick={handleAdd}>
              <i className="fas fa-plus me-2"></i>
              Add Product
            </Button>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>
            <div className="col-md-3">
              <Form.Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
        </Card.Header>
        
        <Card.Body>
          {alert.show && (
            <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, message: '', type: 'success' })}>
              {alert.message}
            </Alert>
          )}

          <Table responsive hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                const discount = product.originalPrice 
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0;

                return (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="rounded"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>
                      <div>
                        <div className="fw-semibold">{product.name}</div>
                        <small className="text-muted">{product.size}</small>
                      </div>
                    </td>
                    <td>
                      <Badge bg="info">{product.category}</Badge>
                    </td>
                    <td>
                      <div>
                        <div className="fw-semibold text-success">₹{product.price}</div>
                        {product.originalPrice && (
                          <small className="text-muted text-decoration-line-through">
                            ₹{product.originalPrice}
                          </small>
                        )}
                        {discount > 0 && (
                          <Badge bg="success" className="ms-1 small">{discount}% OFF</Badge>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="fw-semibold">{product.stock}</span>
                    </td>
                    <td>
                      <Badge bg={stockStatus.variant}>{stockStatus.text}</Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {filteredProducts.length === 0 && (
            <div className="text-center py-4">
              <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
              <h5>No products found</h5>
              <p className="text-muted">
                {searchTerm || filterCategory !== 'all' 
                  ? 'No products match your search criteria' 
                  : 'Add your first product to get started'
                }
              </p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Price (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Original Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Size/Weight *</Form.Label>
              <Form.Control
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                placeholder="e.g., 1 kg, 500 ml, 250 g"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Image URL *</Form.Label>
              <Form.Control
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                required
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="rounded"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : (
                editingProduct ? 'Update Product' : 'Add Product'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ProductManagement;