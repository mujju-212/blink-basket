import React, { useState } from 'react';
import { Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import { addressService } from '../../services/addressService';
import { useLocation } from '../../context/LocationContext';

const AddressSelection = ({ selectedAddress, onAddressSelect }) => {
  const { addresses, addAddress } = useLocation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    house: '',
    area: '',
    city: '',
    pincode: '',
    type: 'home'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!newAddress.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (newAddress.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(newAddress.name.trim())) {
      newErrors.name = 'Name can only contain letters and spaces';
    }
    
    // Phone validation
    if (!newAddress.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(newAddress.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    
    // City validation
    if (!newAddress.city.trim()) {
      newErrors.city = 'City is required';
    } else if (newAddress.city.trim().length < 2) {
      newErrors.city = 'City must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(newAddress.city.trim())) {
      newErrors.city = 'City can only contain letters and spaces';
    }
    
    // Pincode validation
    if (!newAddress.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(newAddress.pincode)) {
      newErrors.pincode = 'Pincode must be exactly 6 digits';
    }
    
    // House validation
    if (!newAddress.house.trim()) {
      newErrors.house = 'House/Flat/Office number is required';
    }
    
    // Area validation
    if (!newAddress.area.trim()) {
      newErrors.area = 'Area/Street/Locality is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const address = addAddress(newAddress);
      setShowAddModal(false);
      setNewAddress({
        name: '',
        phone: '',
        house: '',
        area: '',
        city: '',
        pincode: '',
        type: 'home'
      });
      setErrors({});
      // Auto-select the newly added address
      onAddressSelect(addresses.length);
    } catch (error) {
      console.error('Error adding address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;
    let error = '';

    // Validation based on field type
    switch (name) {
      case 'name':
      case 'city':
        // Only allow letters and spaces
        filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
        if (filteredValue.length < 2 && filteredValue.length > 0) {
          error = `${name === 'name' ? 'Name' : 'City'} must be at least 2 characters`;
        }
        break;
        
      case 'phone':
        // Only allow numbers, max 10 digits
        filteredValue = value.replace(/[^0-9]/g, '').slice(0, 10);
        if (filteredValue.length > 0 && filteredValue.length < 10) {
          error = 'Phone number must be exactly 10 digits';
        }
        break;
        
      case 'pincode':
        // Only allow numbers, max 6 digits for India
        filteredValue = value.replace(/[^0-9]/g, '').slice(0, 6);
        if (filteredValue.length > 0 && filteredValue.length < 6) {
          error = 'Pincode must be exactly 6 digits';
        }
        break;
        
      default:
        filteredValue = value;
    }

    setNewAddress({
      ...newAddress,
      [name]: filteredValue
    });

    // Update errors
    setErrors({
      ...errors,
      [name]: error
    });
  };

  return (
    <>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Select Delivery Address</h5>
          <Button variant="outline-primary" onClick={() => {
            setShowAddModal(true);
            setErrors({});
          }}>
            <i className="fas fa-plus me-2"></i>
            Add New Address
          </Button>
        </Card.Header>
        <Card.Body>
          {addresses.length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-map-marker-alt fa-3x text-muted mb-3"></i>
              <h5>No saved addresses</h5>
              <p className="text-muted">Add an address to continue</p>
            </div>
          ) : (
            <div className="address-list">
              {addresses.map((address, index) => (
                <div
                  key={address.id || index}
                  className={`border rounded p-3 mb-3 cursor-pointer transition-all ${
                    selectedAddress === index ? 'border-primary bg-light' : 'border-secondary'
                  }`}
                  onClick={() => onAddressSelect(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <h6 className="mb-0">{address.name}</h6>
                        <span className="badge bg-secondary small">{address.type.toUpperCase()}</span>
                      </div>
                      <p className="mb-1 text-muted">{address.house}, {address.area}</p>
                      <p className="mb-1 text-muted">{address.city} - {address.pincode}</p>
                      <p className="mb-0 small text-muted">
                        <i className="fas fa-phone me-1"></i>
                        {address.phone}
                      </p>
                    </div>
                    {selectedAddress === index && (
                      <div className="text-success">
                        <i className="fas fa-check-circle fa-lg"></i>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add Address Modal */}
      <Modal show={showAddModal} onHide={() => {
        setShowAddModal(false);
        setErrors({});
      }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Address</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddAddress}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newAddress.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name (letters only)"
                    isInvalid={!!errors.name}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={newAddress.phone}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit phone number"
                    isInvalid={!!errors.phone}
                    maxLength="10"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    {newAddress.phone.length}/10 digits
                  </Form.Text>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>House/Flat/Office No. *</Form.Label>
              <Form.Control
                type="text"
                name="house"
                value={newAddress.house}
                onChange={handleInputChange}
                placeholder="e.g., House No. 123, Flat 4B, Office 501"
                isInvalid={!!errors.house}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.house}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Area/Street/Locality *</Form.Label>
              <Form.Control
                type="text"
                name="area"
                value={newAddress.area}
                onChange={handleInputChange}
                placeholder="e.g., MG Road, Sector 15, Banjara Hills"
                isInvalid={!!errors.area}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.area}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="row">
              <div className="col-md-8">
                <Form.Group className="mb-3">
                  <Form.Label>City *</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleInputChange}
                    placeholder="Enter city name (letters only)"
                    isInvalid={!!errors.city}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Pincode *</Form.Label>
                  <Form.Control
                    type="text"
                    name="pincode"
                    value={newAddress.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit pincode"
                    isInvalid={!!errors.pincode}
                    maxLength="6"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.pincode}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    {newAddress.pincode.length}/6 digits
                  </Form.Text>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
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
                    checked={newAddress.type === type}
                    onChange={handleInputChange}
                  />
                ))}
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Saving...
                </>
              ) : (
                'Save Address'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddressSelection;