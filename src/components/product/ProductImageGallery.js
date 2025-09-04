import React, { useState } from 'react';
import { Modal, Carousel } from 'react-bootstrap';

const ProductImageGallery = ({ images, productName }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleImageClick = (index) => {
    setActiveIndex(index);
    setShowModal(true);
  };

  return (
    <>
      <div className="product-image-gallery">
        <div className="main-image mb-3">
          <img
            src={images[0]}
            alt={productName}
            className="w-100 rounded cursor-pointer"
            style={{ height: '400px', objectFit: 'cover' }}
            onClick={() => handleImageClick(0)}
          />
        </div>
        
        {images.length > 1 && (
          <div className="thumbnail-images d-flex gap-2">
            {images.slice(1, 5).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${productName} ${index + 2}`}
                className="rounded cursor-pointer"
                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                onClick={() => handleImageClick(index + 1)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Body className="p-0">
          <Carousel activeIndex={activeIndex} onSelect={setActiveIndex}>
            {images.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  src={image}
                  alt={`${productName} ${index + 1}`}
                  className="d-block w-100"
                  style={{ height: '500px', objectFit: 'contain' }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductImageGallery;