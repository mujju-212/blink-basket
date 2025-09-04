import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">My Profile</h5>
      </Card.Header>
      <Card.Body>
        {success && (
          <Alert variant="success">
            Profile updated successfully!
          </Alert>
        )}
        
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
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button 
            type="submit" 
            variant="primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Updating...
              </>
            ) : (
              'Update Profile'
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Profile;