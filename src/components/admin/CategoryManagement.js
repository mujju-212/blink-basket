import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import categoryService from '../../services/categoryService';
import { PRODUCTS } from '../../utils/constants';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    // Ensure products are initialized in localStorage
    const storedProducts = localStorage.getItem('products');
    if (!storedProducts) {
      localStorage.setItem('products', JSON.stringify(PRODUCTS));
      console.log('📦 Initialized products in localStorage');
    }
    
    // Get all categories from service (includes both constants and newly added)
    const categoriesData = categoryService.getAllCategories();
    const productsData = JSON.parse(localStorage.getItem('products')) || PRODUCTS;
    
    console.log('🔍 ADMIN LoadCategories Debug:');
    console.log('Categories from service:', categoriesData);
    console.log('Products data:', productsData.length, 'products');
    console.log('localStorage categories:', localStorage.getItem('categories'));
    
    // Count products per category
    const categoriesWithCount = categoriesData.map(category => {
      const productCount = productsData.filter(product => product.category === category.name).length;
      console.log(`Category "${category.name}" has ${productCount} products`);
      return {
        ...category,
        productCount
      };
    });
    
    console.log('Final categories with count:', categoriesWithCount);
    setCategories(categoriesWithCount);
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', image: '' });
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, image: category.image });
    setShowModal(true);
  };

  const handleDelete = (categoryId) => {
    console.log('🗑️ Delete clicked for:', categoryId, typeof categoryId);
    
    const categoryToDelete = categories.find(cat => String(cat.id) === String(categoryId));
    const hasProducts = categoryToDelete && categoryToDelete.productCount > 0;
    
    let confirmMessage = 'Are you sure you want to delete this category?';
    if (hasProducts) {
      confirmMessage = `This category has ${categoryToDelete.productCount} products. Deleting it will make those products uncategorized. Are you sure you want to continue?`;
    }
    
    if (window.confirm(confirmMessage)) {
      console.log('✅ Delete confirmed');
      
      try {
        // Ensure ID is string for consistent comparison
        const idToDelete = String(categoryId);
        console.log('ID to delete (converted to string):', idToDelete);
        
        console.log('Calling categoryService.deleteCategory with ID:', idToDelete);
        const result = categoryService.deleteCategory(idToDelete);
        console.log('Delete result:', result);
        
        if (result && result.success) {
          console.log('✅ Delete successful, reloading categories');
          loadCategories();
          showAlert('Category deleted successfully!');
        } else {
          console.error('❌ Delete failed:', result);
          showAlert('Failed to delete category', 'danger');
        }
      } catch (error) {
        console.error('Delete error:', error);
        showAlert('Error deleting category', 'danger');
      }
    } else {
      console.log('❌ Delete cancelled');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCategory) {
        console.log('Updating category:', editingCategory.id, 'with data:', formData);
        const result = categoryService.updateCategory(editingCategory.id, formData);
        console.log('Update result:', result);
        showAlert('Category updated successfully!');
      } else {
        console.log('Creating new category with data:', formData);
        const result = categoryService.createCategory(formData);
        console.log('Create result:', result);
        showAlert('Category added successfully!');
      }
      
      setShowModal(false);
      
      // Wait a bit for the localStorage updates to complete, then reload
      setTimeout(() => {
        loadCategories();
      }, 100);
    } catch (error) {
      console.error('Save error:', error);
      showAlert('Error saving category', 'danger');
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

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Category Management</h5>
          <Button variant="primary" onClick={handleAdd}>
            <i className="fas fa-plus me-2"></i>
            Add Category
          </Button>
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
                <th>Name</th>
                <th>Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="rounded"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  </td>
                  <td>
                    <div className="fw-semibold">{category.name}</div>
                  </td>
                  <td>
                    <Badge bg="info">{category.productCount} products</Badge>
                  </td>
                  <td>
                    <Badge bg={category.productCount > 0 ? 'success' : 'warning'}>
                      {category.productCount > 0 ? 'Active' : 'Empty'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {categories.length === 0 && (
            <div className="text-center py-4">
              <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
              <h5>No categories found</h5>
              <p className="text-muted">Add your first category to get started</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Category Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter category name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category Image URL *</Form.Label>
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
                editingCategory ? 'Update Category' : 'Add Category'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CategoryManagement;