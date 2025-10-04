import React, { useState, useRef, useEffect } from 'react';
import { Placeholder } from 'react-bootstrap';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  placeholder = null,
  fallback = null,
  threshold = 0.1,
  rootMargin = '50px',
  onLoad = () => {},
  onError = () => {},
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  const handleError = () => {
    setHasError(true);
    onError();
  };

  const getOptimizedSrc = (originalSrc) => {
    if (!originalSrc) return '';
    
    // Add image optimization parameters
    const url = new URL(originalSrc, window.location.origin);
    url.searchParams.set('auto', 'format,compress');
    url.searchParams.set('q', '85');
    
    // Add responsive sizing
    if (imgRef.current) {
      const { width } = imgRef.current.getBoundingClientRect();
      if (width > 0) {
        url.searchParams.set('w', Math.ceil(width * window.devicePixelRatio));
      }
    }
    
    return url.toString();
  };

  return (
    <div ref={imgRef} className={`optimized-image-container ${className}`} {...props}>
      {!isInView && (
        placeholder || (
          <Placeholder
            as="div"
            animation="glow"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f0f0f0',
              backgroundImage: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'loading 1.5s infinite'
            }}
          />
        )
      )}
      
      {isInView && !hasError && (
        <img
          src={getOptimizedSrc(src)}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      
      {hasError && (
        fallback || (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f8f9fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6c757d',
              fontSize: '0.875rem'
            }}
          >
            <i className="fas fa-image me-2"></i>
            Image not available
          </div>
        )
      )}
    </div>
  );
};

export default OptimizedImage;