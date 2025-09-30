// src/pages/Checkout.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaCreditCard, FaCheck } from 'react-icons/fa';
import orderService from '../services/orderService';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    house: '',
    area: '',
    city: '',
    pincode: '',
    type: 'home'
  });
  const [addressErrors, setAddressErrors] = useState({});

  const subtotal = getCartTotal();
  const deliveryFee = subtotal >= 99 ? 0 : 29;
  const handlingFee = 5;
  const total = subtotal + deliveryFee + handlingFee;

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive',
      icon: 'fas fa-money-bill-wave'
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      description: 'GPay, PhonePe, Paytm',
      icon: 'fab fa-google-pay'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, Rupay',
      icon: 'fas fa-credit-card'
    }
  ];

  const steps = [
    { icon: <FaClipboardList />, label: 'Review Order' },
    { icon: <FaCreditCard />, label: 'Payment' },
    { icon: <FaCheck />, label: 'Success' },
  ];

  useEffect(() => {
    // Load saved addresses and auto-select first one
    const savedAddresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
    setAddresses(savedAddresses);
    if (savedAddresses.length > 0) {
      setSelectedAddress(savedAddresses[0]);
    }
  }, []);

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
          setNewAddress({
            ...newAddress,
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

  const handleAddressInputChange = (field, value) => {
    let filteredValue = value;
    let error = '';

    // Validation based on field type
    switch (field) {
      case 'name':
      case 'city':
        // Only allow letters and spaces
        filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
        if (filteredValue.length < 2 && filteredValue.length > 0) {
          error = `${field === 'name' ? 'Name' : 'City'} must be at least 2 characters`;
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
      [field]: filteredValue
    });

    // Update errors
    setAddressErrors({
      ...addressErrors,
      [field]: error
    });
  };

  const validateAddressForm = () => {
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
    
    setAddressErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateAddressForm()) {
      return;
    }
    const address = {
      id: Date.now(),
      ...newAddress,
      name: newAddress.name || (user?.name || currentUser?.name),
      phone: newAddress.phone || (user?.phone || currentUser?.phone)
    };
    
    const updatedAddresses = [...addresses, address];
    setAddresses(updatedAddresses);
    localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
    
    setSelectedAddress(address);
    setShowAddressModal(false);
    setNewAddress({
      name: '',
      phone: '',
      house: '',
      area: '',
      city: '',
      pincode: '',
      type: 'home'
    });
    setAddressErrors({});
    
    // Show notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #26a541; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <i class="fas fa-check-circle me-2"></i>
        Address added successfully!
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    // Create order using orderService
    const orderData = {
      customer: currentUser?.name || user?.displayName || 'Guest User',
      phone: currentUser?.phone || user?.phoneNumber || 'N/A',
      email: currentUser?.email || user?.email || 'N/A',
      address: `${selectedAddress.house}, ${selectedAddress.area}, ${selectedAddress.city} - ${selectedAddress.pincode}`,
      paymentMethod: paymentMethods.find(p => p.id === selectedPayment)?.name || 'Unknown',
      paymentStatus: selectedPayment === 'cod' ? 'Pending' : 'Completed',
      deliveryFee: deliveryFee,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        size: item.size
      })),
      total: total
    };

    // Save order using orderService
    const newOrder = orderService.createOrder(orderData);
    setOrderId(newOrder.id);

    // Clear cart
    clearCart();

    // Show success step
    setOrderPlaced(true);
    setCurrentStep(3);

    // Auto redirect after 5 seconds
    setTimeout(() => {
      navigate('/account?tab=orders');
    }, 5000);
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // From Review to Payment
      if (!selectedAddress) {
        alert('Please select a delivery address first');
        setShowAddressModal(true);
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // From Payment to Place Order
      if (!selectedPayment) {
        alert('Please select a payment method');
        return;
      }
      handlePlaceOrder();
    }
  };

  const prevStep = () => {
    if (currentStep > 1 && !orderPlaced) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <i className="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
          <h4>Your cart is empty</h4>
          <Button 
            variant="primary"
            onClick={() => navigate('/')}
            style={{ backgroundColor: '#ffe01b', borderColor: '#ffe01b', color: '#000' }}
          >
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Progress Steps */}
      <div className="checkout-steps mb-4">
        <div className="d-flex justify-content-center align-items-center">
          {steps.map((step, idx) => (
            <React.Fragment key={step.label}>
              <div className="step-container text-center">
                <div className={`step-circle ${currentStep >= idx + 1 ? 'active' : ''}`}>
                  {step.icon}
                </div>
                <div className="step-text mt-2">
                  <small className={currentStep >= idx + 1 ? 'text-primary fw-bold' : 'text-muted'}>
                    {step.label}
                  </small>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className={`step-line mx-2 ${currentStep > idx + 1 ? 'active' : ''}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 3: Order Success Animation */}
      {currentStep === 3 && orderPlaced && (
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="text-center border-0 shadow-lg">
              <Card.Body className="py-5">
                <div className="success-animation mb-4">
                  <div className="success-checkmark">
                    <div className="check-icon">
                      <span className="icon-line line-tip"></span>
                      <span className="icon-line line-long"></span>
                      <div className="icon-circle"></div>
                      <div className="icon-fix"></div>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-success mb-3">Order Placed Successfully!</h2>
                <p className="text-muted mb-4">
                  Thank you for your order. Your groceries will be delivered in 10-15 minutes.
                </p>

                <Alert variant="success" className="mb-4">
                  <Row>
                    <Col md={6}>
                      <div className="text-start">
                        <strong>Order ID: {orderId}</strong>
                        <div className="small text-muted">
                          <i className="fas fa-clock me-1"></i>
                          Estimated delivery: 10-15 minutes
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="text-end">
                        <div className="fw-bold fs-5">₹{total}</div>
                        <div className="small text-muted">
                          {paymentMethods.find(p => p.id === selectedPayment)?.name}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Alert>

                <div className="delivery-info mb-4 p-3 bg-light rounded">
                  <h6 className="mb-2">
                    <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                    Delivering to:
                  </h6>
                  <div className="text-muted">
                    {selectedAddress?.name} - {selectedAddress?.type.toUpperCase()}<br/>
                    {selectedAddress?.house}, {selectedAddress?.area}<br/>
                    {selectedAddress?.city} - {selectedAddress?.pincode}
                  </div>
                </div>

                <div className="d-flex gap-3 justify-content-center">
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/account?tab=orders')}
                    style={{ backgroundColor: '#ffe01b', borderColor: '#ffe01b', color: '#000' }}
                  >
                    <i className="fas fa-shopping-bag me-2"></i>
                    Track Order
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => navigate('/')}
                  >
                    <i className="fas fa-home me-2"></i>
                    Continue Shopping
                  </Button>
                </div>

                <div className="mt-4">
                  <small className="text-muted">
                    Redirecting to order tracking in <span id="countdown">5</span> seconds...
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Steps 1 & 2 Content */}
      {currentStep < 3 && (
        <Row>
          <Col md={8}>
            {/* Step 1: Review Order */}
            {currentStep === 1 && (
              <Card>
                <Card.Header>
                  <h5 className="mb-0">
                    <i className="fas fa-clipboard-list me-2"></i>
                    Review Your Order
                  </h5>
                </Card.Header>
                <Card.Body>
                  {/* Order Items */}
                  <div className="mb-4">
                    <h6 className="mb-3">Order Items ({cart.length}):</h6>
                    {cart.map(item => (
                      <div key={item.id} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            className="rounded me-3"
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/60x60/f8f9fa/6c757d?text=${item.name.substring(0, 2)}`;
                            }}
                          />
                          <div>                            <div className="fw-semibold">{item.name}</div>
                            <div className="text-muted small">{item.size}</div>
                            <div className="small">
                              <span className="text-success fw-bold">₹{item.price}</span>
                              <span className="text-muted"> × {item.quantity}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold">₹{item.price * item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address Section */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        Delivery Address
                      </h6>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => setShowAddressModal(true)}
                      >
                        <i className="fas fa-plus me-1"></i>
                        Add New
                      </Button>
                    </div>

                    {addresses.length === 0 ? (
                      <Alert variant="warning">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        No delivery address found. Please add an address to continue.
                        <Button 
                          variant="warning" 
                          size="sm" 
                          className="ms-2"
                          onClick={() => setShowAddressModal(true)}
                        >
                          Add Address
                        </Button>
                      </Alert>
                    ) : (
                      <div className="addresses-list">
                        {addresses.map(address => (
                          <div 
                            key={address.id} 
                            className={`address-card p-3 mb-2 border rounded ${selectedAddress?.id === address.id ? 'border-primary bg-light' : ''}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedAddress(address)}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="mb-1">
                                  <i className={`fas fa-${address.type === 'home' ? 'home' : address.type === 'office' ? 'building' : 'map-marker-alt'} me-2`}></i>
                                  {address.name} - {address.type.toUpperCase()}
                                </h6>
                                <p className="mb-1 text-muted">{address.house}, {address.area}</p>
                                <p className="mb-1 text-muted">{address.city} - {address.pincode}</p>
                                <small className="text-muted">
                                  <i className="fas fa-phone me-1"></i>
                                  {address.phone}
                                </small>
                              </div>
                              {selectedAddress?.id === address.id && (
                                <i className="fas fa-check-circle text-primary fa-lg"></i>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Delivery Time */}
                  <Alert variant="info">
                    <i className="fas fa-clock me-2"></i>
                    <strong>Estimated Delivery:</strong> 10-15 minutes from order confirmation
                  </Alert>
                </Card.Body>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <Card>
                <Card.Header>
                  <h5 className="mb-0">
                    <i className="fas fa-credit-card me-2"></i>
                    Select Payment Method
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="payment-methods">
                    {paymentMethods.map(method => (
                      <div 
                        key={method.id}
                        className={`payment-method p-4 mb-3 border rounded d-flex align-items-center ${selectedPayment === method.id ? 'border-primary bg-light' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedPayment(method.id)}
                      >
                        <i className={`${method.icon} fa-2x me-3 text-primary`}></i>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{method.name}</h6>
                          <small className="text-muted">{method.description}</small>
                        </div>
                        {selectedPayment === method.id && (
                          <i className="fas fa-check-circle text-primary fa-lg"></i>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Selected Address Summary */}
                  <div className="mt-4">
                    <h6>Delivering to:</h6>
                    <div className="bg-light p-3 rounded">
                      <div className="fw-semibold">{selectedAddress?.name} - {selectedAddress?.type.toUpperCase()}</div>
                      <div className="text-muted">{selectedAddress?.house}, {selectedAddress?.area}</div>
                      <div className="text-muted">{selectedAddress?.city} - {selectedAddress?.pincode}</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between mt-4">
              {currentStep > 1 && !orderPlaced && (
                <Button variant="outline-secondary" onClick={prevStep}>
                  <i className="fas fa-arrow-left me-2"></i>
                  Previous
                </Button>
              )}
              <div className="ms-auto">
                {currentStep === 1 && (
                  <Button 
                    variant="primary" 
                    onClick={nextStep}
                    disabled={!selectedAddress}
                    style={{ backgroundColor: '#ffe01b', borderColor: '#ffe01b', color: '#000' }}
                  >
                    Continue to Payment
                    <i className="fas fa-arrow-right ms-2"></i>
                  </Button>
                )}
                {currentStep === 2 && (
                  <Button 
                    variant="success" 
                    onClick={nextStep}
                    disabled={!selectedPayment}
                    size="lg"
                  >
                    <i className="fas fa-check me-2"></i>
                    Place Order - ₹{total}
                  </Button>
                )}
              </div>
            </div>
          </Col>

          {/* Order Summary Sidebar */}
          <Col md={4}>
            <Card className="sticky-top" style={{ top: '100px' }}>
              <Card.Header>
                <h6 className="mb-0">
                  <i className="fas fa-receipt me-2"></i>
                  Order Summary
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-success' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Handling Fee</span>
                  <span>₹{handlingFee}</span>
                </div>
                
                {subtotal < 99 && (
                  <Alert variant="info" className="small py-2 mt-3">
                    <i className="fas fa-info-circle me-1"></i>
                    Add ₹{99 - subtotal} more for FREE delivery!
                  </Alert>
                )}
                
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span className="text-success">₹{total}</span>
                </div>
                
                <div className="mt-3 p-2 bg-light rounded">
                  <small className="text-muted d-block">
                    <i className="fas fa-clock me-1"></i>
                    Delivery: 10-15 minutes
                  </small>
                  <small className="text-muted d-block">
                    <i className="fas fa-shield-alt me-1"></i>
                    100% Safe & Secure
                  </small>
                </div>

                {/* Progress Indicator */}
                <div className="mt-3">
                  <div className="progress" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${(currentStep / 3) * 100}%`,
                        backgroundColor: '#ffe01b'
                      }}
                    ></div>
                  </div>
                  <small className="text-muted">
                    Step {currentStep} of 3
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Add Address Modal */}
      <Modal show={showAddressModal} onHide={() => {
        setShowAddressModal(false);
        setAddressErrors({});
      }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-map-marker-alt me-2"></i>
            Add New Address
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddAddress}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newAddress.name}
                    onChange={(e) => handleAddressInputChange('name', e.target.value)}
                    placeholder={user?.name || currentUser?.name || "Enter full name (letters only)"}
                    isInvalid={!!addressErrors.name}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {addressErrors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) => handleAddressInputChange('phone', e.target.value)}
                    placeholder={user?.phone || currentUser?.phone || "Enter 10-digit phone number"}
                    isInvalid={!!addressErrors.phone}
                    maxLength="10"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {addressErrors.phone}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    {newAddress.phone.length}/10 digits
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>House/Flat/Office No.</Form.Label>
              <Form.Control
                type="text"
                value={newAddress.house}
                onChange={(e) => handleAddressInputChange('house', e.target.value)}
                placeholder="e.g., House No. 123, Flat 4B, Office 501"
                isInvalid={!!addressErrors.house}
                required
              />
              <Form.Control.Feedback type="invalid">
                {addressErrors.house}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Area/Street/Locality</Form.Label>
                  <Form.Control
                    type="text"
                    value={newAddress.area}
                    onChange={(e) => handleAddressInputChange('area', e.target.value)}
                    placeholder="e.g., MG Road, Sector 15, Banjara Hills"
                    isInvalid={!!addressErrors.area}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {addressErrors.area}
                  </Form.Control.Feedback>
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
                    value={newAddress.city}
                    onChange={(e) => handleAddressInputChange('city', e.target.value)}
                    placeholder="Enter city name (letters only)"
                    isInvalid={!!addressErrors.city}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {addressErrors.city}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    value={newAddress.pincode}
                    onChange={(e) => handleAddressInputChange('pincode', e.target.value)}
                    placeholder="6-digit pincode"
                    isInvalid={!!addressErrors.pincode}
                    maxLength="6"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {addressErrors.pincode}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    {newAddress.pincode.length}/6 digits
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Address Type</Form.Label>
              <div className="d-flex gap-3">
                <Form.Check
                  type="radio"
                  id="home"
                  name="addressType"
                  label="🏠 Home"
                  checked={newAddress.type === 'home'}
                  onChange={() => setNewAddress({...newAddress, type: 'home'})}
                />
                <Form.Check
                  type="radio"
                  id="office"
                  name="addressType"
                  label="🏢 Office"
                  checked={newAddress.type === 'office'}
                  onChange={() => setNewAddress({...newAddress, type: 'office'})}
                />
                <Form.Check
                  type="radio"
                  id="other"
                  name="addressType"
                  label="📍 Other"
                  checked={newAddress.type === 'other'}
                  onChange={() => setNewAddress({...newAddress, type: 'other'})}
                />
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => {
              setShowAddressModal(false);
              setAddressErrors({});
            }}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              style={{ backgroundColor: '#ffe01b', borderColor: '#ffe01b', color: '#000' }}
            >
              <i className="fas fa-save me-2"></i>
              Save Address
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Checkout;