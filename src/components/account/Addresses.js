import React, { useState } from 'react';
import { Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import { addressService } from '../../services/addressService';

const Addresses = () => {
  const { addresses, addAddress, updateAddress, deleteAddress } = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    house: '',
    area: '',
    city: '',
    pincode: '',
    type: 'home'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      name: '',
      phone: '',
      house: '',
      area: '',
      city: '',
      pincode: '',
      type: 'home'
    });
    setShowModal(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowModal(true);
  };

  const handleDelete = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      deleteAddress(addressId);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingAddress) {
        updateAddress(editingAddress.id, formData);
      } else {
        addAddress(formData);
      }
      
      setSuccess(true);
      setShowModal(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Saved Addresses</h5>
          <Button variant="primary" onClick={handleAddNew}>
            <i className="fas fa-plus me-2"></i>
            Add New Address
          </Button>
        </Card.Header>
        <Card.Body>
          {success && (
            <Alert variant="success">
              Address {editingAddress ? 'updated' : 'added'} successfully!
            </Alert>
          )}

          {addresses.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-map-marker-alt fa-4x text-muted mb-3"></i>
              <h5>No saved addresses</h5>
              <p className="text-muted">Add an address to get started</p>
            </div>
          ) : (
            addresses.map((address) => (
              <Card key={address.id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6>{address.name} - {address.type.toUpperCase()}</h6>
                      <p className="mb-1">{address.house}, {address.area}</p>
                      <p className="mb-1">{address.city} - {address.pincode}</p>
                      <p className="text-muted mb-0">{address.phone}</p>
                    </div>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleEdit(address)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(address.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Address Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>House/Flat/Office No.</Form.Label>
              <Form.Control
                type="text"
                name="house"
                value={formData.house}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Area/Street/Locality</Form.Label>
              <Form.Control
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Pincode</Form.Label>
              <Form.Control
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Address Type</Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="home">Home</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                type="submit" 
                variant="primary"
                disabled={loading}
                className="flex-grow-1"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  editingAddress ? 'Update Address' : 'Save Address'
                )}
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Addresses;