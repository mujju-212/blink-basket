import React from 'react';
import './LoadingComponents.css';

// Skeleton Loader Component
export const SkeletonLoader = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  className = '' 
}) => (
  <div 
    className={`skeleton-loader ${className}`}
    style={{ 
      width, 
      height, 
      borderRadius,
      backgroundColor: '#f0f0f0',
      backgroundImage: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'loading 1.5s infinite'
    }}
  />
);

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <div className="product-card-skeleton p-3 border rounded">
    <SkeletonLoader height="120px" className="mb-2" />
    <SkeletonLoader height="16px" className="mb-1" />
    <SkeletonLoader height="14px" width="60%" className="mb-2" />
    <SkeletonLoader height="32px" className="mb-2" />
    <SkeletonLoader height="36px" />
  </div>
);

// Loading Spinner
export const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClass = {
    sm: 'spinner-sm',
    md: 'spinner-md', 
    lg: 'spinner-lg'
  }[size];

  return (
    <div className={`loading-spinner ${sizeClass}`}>
      <div className={`spinner-border text-${color}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

// Pulse Animation for buttons
export const PulseButton = ({ children, className = '', ...props }) => (
  <button 
    className={`pulse-button ${className}`} 
    {...props}
  >
    {children}
  </button>
);

// Shimmer Effect
export const ShimmerCard = ({ children, isLoading = false }) => (
  <div className={`shimmer-wrapper ${isLoading ? 'shimmer-active' : ''}`}>
    {children}
  </div>
);

// Progress Bar
export const ProgressBar = ({ progress = 0, showLabel = true, color = 'success' }) => (
  <div className="progress-container">
    <div className="progress" style={{ height: '8px' }}>
      <div 
        className={`progress-bar bg-${color}`}
        role="progressbar"
        style={{ 
          width: `${progress}%`,
          transition: 'width 0.3s ease'
        }}
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>
    {showLabel && (
      <small className="text-muted mt-1">{progress}% complete</small>
    )}
  </div>
);

// Floating Action Button
export const FloatingActionButton = ({ 
  icon, 
  onClick, 
  position = 'bottom-right',
  color = 'primary'
}) => (
  <button 
    className={`fab fab-${position} btn btn-${color} rounded-circle shadow`}
    onClick={onClick}
    style={{
      position: 'fixed',
      width: '56px',
      height: '56px',
      zIndex: 1000,
      border: 'none'
    }}
  >
    <i className={`fas ${icon}`}></i>
  </button>
);

// Animated Counter
export const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className="animated-counter">{count}</span>;
};

export default {
  SkeletonLoader,
  ProductCardSkeleton,
  LoadingSpinner,
  PulseButton,
  ShimmerCard,
  ProgressBar,
  FloatingActionButton,
  AnimatedCounter
};