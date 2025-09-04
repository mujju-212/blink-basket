import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { BANNER_SLIDES } from '../../utils/constants';

const Banner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % BANNER_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="banner-section my-4">
      <Carousel 
        activeIndex={index} 
        onSelect={handleSelect}
        controls={true}
        indicators={true}
        interval={null}
        className="rounded overflow-hidden shadow"
      >
        {BANNER_SLIDES.map((slide) => (
          <Carousel.Item key={slide.id}>
            <div 
              className="position-relative"
              style={{ height: '300px' }}
            >
              <img
                className="d-block w-100 h-100"
                src={slide.image}
                alt={slide.title}
                style={{ objectFit: 'cover' }}
              />
              <div className="position-absolute top-50 start-0 translate-middle-y text-white ps-5">
                <h1 className="display-4 fw-bold mb-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                  {slide.title}
                </h1>
                <p className="fs-5 mb-4" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                  {slide.subtitle}
                </p>
                <button className="btn btn-primary btn-lg">
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;