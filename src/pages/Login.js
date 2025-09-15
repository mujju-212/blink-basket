import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(timer => timer - 1);
      }, 1000);
    } else if (resendTimer === 0 && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    
    try {
      const result = await authService.sendOTP(phone);
      
      if (result.success) {
        setShowOtpModal(true);
        setOtpSent(true);
        setResendTimer(60); // 60 seconds before resend is allowed
        
        // Show demo OTP in development mode
        if (result.demo && result.demoOTP) {
          alert(`Demo Mode - OTP: ${result.demoOTP}`);
        }
      } else {
        setError(result.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    
    try {
      const result = await authService.verifyOTPAndLogin(phone, otp);
      
      if (result.success) {
        login(phone);
        setShowOtpModal(false);
        
        // Redirect to the page user intended to visit before login
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setError('');
    setLoading(true);
    
    try {
      const result = await authService.sendOTP(phone);
      
      if (result.success) {
        setResendTimer(60);
        
        // Show demo OTP in development mode
        if (result.demo && result.demoOTP) {
          alert(`Demo Mode - New OTP: ${result.demoOTP}`);
        }
      } else {
        setError(result.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h3>Login to Blinkit</h3>
                  <p className="text-muted">
                    Get groceries delivered in 10 minutes
                  </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

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

                <div className="mt-3 p-3 bg-light rounded">
                  <small className="text-muted">
                    <strong>Real SMS Authentication:</strong><br/>
                    Enter your phone number to receive OTP via SMS<br/>
                    <strong>Demo Mode:</strong> Works with any 10-digit number
                  </small>
                </div>
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
          
          {error && <Alert variant="danger">{error}</Alert>}
          
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
                {process.env.REACT_APP_ENV === 'development' && 
                  'Demo Mode: Check console/alert for OTP'
                }
              </Form.Text>
            </Form.Group>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-100 mb-3"
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

          <div className="text-center">
            <div className="d-flex justify-content-between align-items-center">
              <Button 
                variant="link" 
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp('');
                  setError('');
                }}
                className="text-decoration-none"
              >
                Change Phone Number
              </Button>
              
              <Button 
                variant="link" 
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || loading}
                className="text-decoration-none"
              >
                {resendTimer > 0 ? (
                  `Resend OTP in ${resendTimer}s`
                ) : (
                  'Resend OTP'
                )}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Login;