import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import './ToastSystem.css';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 5000, options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      duration,
      createdAt: new Date(),
      ...options
    };

    setToasts(prev => [...prev, toast]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message, options = {}) => {
    return addToast(message, 'success', 4000, {
      icon: 'fas fa-check-circle',
      ...options
    });
  }, [addToast]);

  const showError = useCallback((message, options = {}) => {
    return addToast(message, 'error', 6000, {
      icon: 'fas fa-exclamation-circle',
      ...options
    });
  }, [addToast]);

  const showWarning = useCallback((message, options = {}) => {
    return addToast(message, 'warning', 5000, {
      icon: 'fas fa-exclamation-triangle',
      ...options
    });
  }, [addToast]);

  const showInfo = useCallback((message, options = {}) => {
    return addToast(message, 'info', 4000, {
      icon: 'fas fa-info-circle',
      ...options
    });
  }, [addToast]);

  const showLoading = useCallback((message, options = {}) => {
    return addToast(message, 'loading', 0, {
      icon: 'fas fa-spinner fa-spin',
      ...options
    });
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer className="toast-container-custom" position="top-end">
        {toasts.map((toast) => (
          <CustomToast
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

const CustomToast = ({ toast, onClose }) => {
  const getToastStyle = (type) => {
    const styles = {
      success: {
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb',
        color: '#155724'
      },
      error: {
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
        color: '#721c24'
      },
      warning: {
        backgroundColor: '#fff3cd',
        borderColor: '#ffeaa7',
        color: '#856404'
      },
      info: {
        backgroundColor: '#d1ecf1',
        borderColor: '#bee5eb',
        color: '#0c5460'
      },
      loading: {
        backgroundColor: '#e2e3e5',
        borderColor: '#d6d8db',
        color: '#383d41'
      }
    };
    return styles[type] || styles.info;
  };

  return (
    <Toast
      show={true}
      onClose={onClose}
      className={`custom-toast toast-${toast.type}`}
      style={getToastStyle(toast.type)}
    >
      <Toast.Header closeButton={toast.duration > 0}>
        <div className="d-flex align-items-center">
          {toast.icon && (
            <i className={`${toast.icon} me-2`} style={{ fontSize: '1.1rem' }}></i>
          )}
          <strong className="me-auto">
            {toast.title || toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
          </strong>
          <small className="text-muted">
            {new Date(toast.createdAt).toLocaleTimeString()}
          </small>
        </div>
      </Toast.Header>
      <Toast.Body>
        {typeof toast.message === 'string' ? (
          <span>{toast.message}</span>
        ) : (
          toast.message
        )}
        {toast.action && (
          <div className="mt-2">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={toast.action.handler}
            >
              {toast.action.label}
            </button>
          </div>
        )}
      </Toast.Body>
    </Toast>
  );
};

// Custom hook for common toast patterns
export const useCommonToasts = () => {
  const toast = useToast();

  return {
    // Cart operations
    showAddedToCart: (productName) => 
      toast.showSuccess(`${productName} added to cart`, {
        action: {
          label: 'View Cart',
          handler: () => window.location.href = '/cart'
        }
      }),
    
    showRemovedFromCart: (productName) => 
      toast.showInfo(`${productName} removed from cart`),

    // Order operations  
    showOrderPlaced: (orderNumber) =>
      toast.showSuccess(`Order #${orderNumber} placed successfully!`, {
        action: {
          label: 'Track Order',
          handler: () => window.location.href = `/orders/${orderNumber}`
        }
      }),

    // Authentication
    showLoginSuccess: () => 
      toast.showSuccess('Welcome back!'),
    
    showLogoutSuccess: () => 
      toast.showInfo('Successfully logged out'),

    // Network errors
    showNetworkError: () => 
      toast.showError('Network error. Please check your connection.'),
    
    showServerError: () => 
      toast.showError('Server error. Please try again later.'),

    // Loading states
    showSaving: () => 
      toast.showLoading('Saving changes...'),
    
    showProcessingPayment: () => 
      toast.showLoading('Processing payment...')
  };
};

export default ToastProvider;