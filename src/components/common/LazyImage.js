import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ src, alt, className, style, placeholder, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e) => {
    e.target.src = placeholder || 'https://via.placeholder.com/400x400/f8f9fa/6c757d?text=Image';
  };

  return (
    <div ref={imgRef} className={className} style={style}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            ...style
          }}
          {...props}
        />
      )}
      {!isLoaded && isInView && (
        <div 
          className="d-flex align-items-center justify-content-center bg-light"
          style={{ 
            width: '100%', 
            height: '100%', 
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;