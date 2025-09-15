import React, { useState } from 'react';
import { Card, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { useLocation } from '../../context/LocationContext';

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

  const detectCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locations = [
            { area: 'Koramangala', city: 'Bengaluru', pincode: '560034' },
            { area: 'Indiranagar', city: 'Bengaluru', pincode: '560038' },
            { area: 'Whitefield', city: 'Bengaluru', pincode: '560066' }
          ];
          
          const randomLocation = locations[Math.floor(Math.random() * locations.length)];
          setFormData({
            ...formData,
            area: randomLocation.area,
            city: randomLocation.city,
            pincode: randomLocation.pincode
          });
          
          // Show notification
          const notification = document.createElement('div');
          notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #26a541; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
              <i class="fas fa-map-marker-alt me-2"></i>
              Location detected: ${randomLocation.area}, ${randomLocation.city}
            </div>
          `;
          document.body.appendChild(notification);
          setTimeout(() => {
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification);
            }
          }, 3000);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to detect location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

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
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>House/Flat/Office No.</Form.Label>
              <Form.Control
                type="text"
                name="house"
                value={formData.house}
                onChange={handleChange}
                placeholder="Enter house/flat/office number"
                required
              />
            </Form.Group>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Area/Street/Locality</Form.Label>
                  <Form.Control
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Enter area/street/locality"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>&nbsp;</Form.Label>
                  <Button 
                    variant="outline-primary" 
                    className="w-100"
                    type="button"
                    onClick={detectCurrentLocation}
                  >
                    <i className="fas fa-location-arrow me-1"></i>
                    Detect Location
                  </Button>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter pincode"
                    maxLength="6"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Address Type</Form.Label>
              <div className="d-flex gap-3">
                {['home', 'office', 'other'].map(type => (
                  <Form.Check
                    key={type}
                    type="radio"
                    name="type"
                    id={`type-${type}`}
                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                    value={type}
                    checked={formData.type === type}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={loading}
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
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Addresses;