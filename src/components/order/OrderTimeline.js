import React from 'react';
import { Card } from 'react-bootstrap';

const OrderTimeline = ({ timeline, currentStatus }) => {
  const getStepIcon = (status, completed) => {
    const icons = {
      'Order Placed': 'fas fa-shopping-cart',
      'Order Confirmed': 'fas fa-check-circle',
      'Preparing': 'fas fa-utensils',
      'Out for Delivery': 'fas fa-truck',
      'Delivered': 'fas fa-box-open'
    };
    
    return completed ? 'fas fa-check' : icons[status] || 'fas fa-clock';
  };

  const getStepColor = (status, completed, current) => {
    if (completed) return 'success';
    if (current) return 'primary';
    return 'muted';
  };

  return (
    <Card>
      <Card.Header>
        <h6 className="mb-0">Order Timeline</h6>
      </Card.Header>
      <Card.Body>
        <div className="timeline">
          {timeline.map((step, index) => {
            const isCompleted = step.completed;
            const isCurrent = !isCompleted && index === timeline.findIndex(s => !s.completed);
            const color = getStepColor(step.status, isCompleted, isCurrent);
            
            return (
              <div key={index} className="timeline-item d-flex align-items-start mb-4">
                <div 
                  className={`timeline-icon rounded-circle d-flex align-items-center justify-content-center me-3 bg-${color} ${
                    color === 'muted' ? 'text-muted' : 'text-white'
                  }`}
                  style={{ width: '40px', height: '40px', minWidth: '40px' }}
                >
                  <i className={getStepIcon(step.status, isCompleted)}></i>
                </div>
                
                <div className="timeline-content flex-grow-1">
                  <h6 className={`mb-1 text-${color === 'muted' ? 'muted' : 'dark'}`}>
                    {step.status}
                  </h6>
                  {step.time && (
                    <p className="mb-0 small text-muted">{step.time}</p>
                  )}
                  {isCurrent && (
                    <div className="mt-2">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      <span className="small text-primary">In progress...</span>
                    </div>
                  )}
                </div>
                
                {/* Timeline connector line */}
                {index < timeline.length - 1 && (
                  <div 
                    className="timeline-connector"
                    style={{
                      position: 'absolute',
                      left: '19px',
                      top: '40px',
                      width: '2px',
                      height: '40px',
                      backgroundColor: isCompleted ? '#198754' : '#dee2e6',
                      marginLeft: '20px'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderTimeline;