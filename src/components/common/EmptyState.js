import React from 'react';
import { Button } from 'react-bootstrap';

const EmptyState = ({ 
  icon = 'fas fa-box-open', 
  title = 'Nothing here yet', 
  description = 'Items will appear here when available',
  actionText,
  onAction
}) => {
  return (
    <div className="text-center py-5">
      <i className={`${icon} fa-4x text-muted mb-3`}></i>
      <h4 className="text-muted mb-2">{title}</h4>
      <p className="text-muted mb-4">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;