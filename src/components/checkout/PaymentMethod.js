import React from 'react';
import { Card } from 'react-bootstrap';
import { PAYMENT_METHODS } from '../../utils/constants';

const PaymentMethod = ({ selectedMethod, onMethodSelect }) => {
  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Select Payment Method</h5>
      </Card.Header>
      <Card.Body>
        <div className="payment-methods">
          {PAYMENT_METHODS.map(method => (
            <div
              key={method.id}
              className={`border rounded p-3 mb-3 cursor-pointer d-flex align-items-center transition-all ${
                selectedMethod === method.id ? 'border-primary bg-light' : 'border-secondary'
              }`}
              onClick={() => onMethodSelect(method.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="payment-icon me-3">
                <i className={`${method.icon} fa-2x text-primary`}></i>
              </div>
              <div className="flex-grow-1">
                <h6 className="mb-1">{method.name}</h6>
                <p className="mb-0 text-muted small">{method.description}</p>
              </div>
              {selectedMethod === method.id && (
                <div className="text-success">
                  <i className="fas fa-check-circle fa-lg"></i>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedMethod === 'card' && (
          <Card className="mt-3 border-primary">
            <Card.Body>
              <h6 className="mb-3">Card Details</h6>
              <div className="row">
                <div className="col-12 mb-3">
                  <label className="form-label">Card Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Expiry Date</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">CVV</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="123"
                    maxLength="3"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Cardholder Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="John Doe"
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {selectedMethod === 'upi' && (
          <Card className="mt-3 border-primary">
            <Card.Body>
              <h6 className="mb-3">UPI Payment</h6>
              <div className="mb-3">
                <label className="form-label">UPI ID</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="yourname@paytm"
                />
              </div>
              <div className="d-flex gap-3">
                <div className="border rounded p-2" style={{ width: '60px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                  <span className="small fw-bold">GPay</span>
                </div>
                <div className="border rounded p-2" style={{ width: '60px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                  <span className="small fw-bold">PhonePe</span>
                </div>
                <div className="border rounded p-2" style={{ width: '60px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                  <span className="small fw-bold">Paytm</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
      </Card.Body>
    </Card>
  );
};

export default PaymentMethod;