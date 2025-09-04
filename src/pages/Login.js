import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, adminLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  React.useEffect(() => {
    const adminMode = searchParams.get('admin') === 'true';
    setIsAdmin(adminMode);
  }, [searchParams]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = adminLogin(credentials.username, credentials.password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid admin credentials. Use username: admin, password: admin123');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setShowOtpModal(true);
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      login(phone);
      setLoading(false);
      setShowOtpModal(false);
      
      // Redirect to the page user intended to visit before login
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }, 1000);
  };

  return (
    <>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h3>{isAdmin ? 'Admin Login' : 'Login to Blinkit'}</h3>
                  <p className="text-muted">
                    {isAdmin ? 'Access admin dashboard' : 'Get groceries delivered in 10 minutes'}
                  </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                {isAdmin ? (
                  <Form onSubmit={handleAdminLogin}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={credentials.username}
                        onChange={(e) => setCredentials({
                          ...credentials,
                          username: e.target.value
                        })}
                        placeholder="Enter admin username"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({
                          ...credentials,
                          password: e.target.value
                        })}
                        placeholder="Enter admin password"
                        required
                      />
                    </Form.Group>

                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Logging in...
                        </>
                      ) : (
                        'Login as Admin'
                      )}
                    </Button>
                  </Form>
                ) : (
                  <Form onSubmit={handleSendOtp}>
                    <Form.Group className="mb-4">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter your 10-digit phone number"
                        maxLength="10"
                        required
                      />
                                      <Form.Text className="text-muted">
                        We'll send you an OTP to verify your number
                      </Form.Text>
                    </Form.Group>

                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Sending OTP...
                        </>
                      ) : (
                        'Send OTP'
                      )}
                    </Button>
                  </Form>
                )}

                <div className="text-center mt-3">
                  <Button 
                    variant="link" 
                    onClick={() => setIsAdmin(!isAdmin)}
                    className="text-decoration-none"
                  >
                    {isAdmin ? 'Customer Login' : 'Admin Login'}
                  </Button>
                </div>

                {isAdmin && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <small className="text-muted">
                      <strong>Demo Credentials:</strong><br/>
                      Username: <code>admin</code><br/>
                      Password: <code>admin123</code>
                    </small>
                  </div>
                )}

                {!isAdmin && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <small className="text-muted">
                      <strong>Demo Login:</strong><br/>
                      Enter any 10-digit phone number<br/>
                      OTP: Any 6-digit number works
                    </small>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* OTP Modal */}
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Verify OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center mb-3">
            Enter the OTP sent to <strong>+91 {phone}</strong>
          </p>
          
          <Form onSubmit={handleVerifyOtp}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                className="text-center fs-4 py-3"
                style={{ letterSpacing: '0.5rem' }}
                required
              />
              <Form.Text className="text-muted text-center d-block">
                Demo: Enter any 6-digit number (e.g., 123456)
              </Form.Text>
            </Form.Group>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-100"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <Button 
              variant="link" 
              onClick={() => {
                setShowOtpModal(false);
                setOtp('');
              }}
              className="text-decoration-none"
            >
              Change Phone Number
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Login;