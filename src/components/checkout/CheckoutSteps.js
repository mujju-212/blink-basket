import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const CheckoutSteps = ({ currentStep, steps }) => {
  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'pending';
  };

  const getProgressPercentage = () => {
    return ((currentStep - 1) / (steps.length - 1)) * 100;
  };

  return (
    <div className="checkout-steps mb-4">
      <ProgressBar 
        now={getProgressPercentage()} 
        className="mb-3"
        style={{ height: '4px' }}
      />
      
      <div className="d-flex justify-content-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const status = getStepStatus(stepNumber);
          
          return (
            <div
              key={step.id}
              className={`d-flex flex-column align-items-center ${
                status === 'completed' ? 'text-success' :
                status === 'active' ? 'text-primary' : 'text-muted'
              }`}
            >
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                  status === 'completed' ? 'bg-success text-white' :
                  status === 'active' ? 'bg-primary text-white' : 'bg-light'
                }`}
                style={{ width: '40px', height: '40px' }}
              >
                {status === 'completed' ? (
                  <i className="fas fa-check"></i>
                ) : (
                  <i className={step.icon}></i>
                )}
              </div>
              <span className="fw-semibold small text-center">{step.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;