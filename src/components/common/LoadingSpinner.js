import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return 'spinner-border-sm';
      case 'lg': return 'spinner-border-lg';
      default: return '';
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" variant="primary" className={getSize()} />
      {text && <p className="mt-3 text-muted">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;