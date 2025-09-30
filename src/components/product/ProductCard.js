import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    
    // Show notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #26a541; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <i class="fas fa-check-circle me-2"></i>
        ${product.name} added to cart!
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    
    // Show notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: ${added ? '#dc3545' : '#6c757d'}; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <i class="fas fa-heart me-2"></i>
        ${added ? 'Added to wishlist!' : 'Removed from wishlist!'}
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card 
      className="h-100 product-card position-relative shadow-sm"
      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
      onClick={handleProductClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}
    >
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={product.image} 
          alt={product.name}
          style={{ height: '120px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/120x120/f8f9fa/6c757d?text=${product.name.substring(0, 8)}`;
          }}
        />
        
        <Button
          variant={isInWishlist(product.id) ? "danger" : "outline-danger"}
          size="sm"
          className="position-absolute top-0 end-0 m-1"
          onClick={handleToggleWishlist}
          style={{ 
            zIndex: 10,
            backgroundColor: isInWishlist(product.id) ? '#dc3545' : 'rgba(255,255,255,0.95)',
            color: isInWishlist(product.id) ? 'white' : '#dc3545',
            border: isInWishlist(product.id) ? 'none' : '1px solid #dc3545',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            fontSize: '0.7rem'
          }}
        >
          <i className="fas fa-heart"></i>
        </Button>

        {discount > 0 && (
          <Badge 
            bg="success" 
            className="position-absolute top-0 start-0 m-1"
            style={{ fontSize: '0.65rem', padding: '0.25rem 0.4rem' }}
          >
            {discount}% OFF
          </Badge>
        )}

        {product.stock < 10 && product.stock > 0 && (
          <Badge 
            bg="warning" 
            className="position-absolute bottom-0 start-0 m-2"
            style={{ fontSize: '0.7rem' }}
          >
            Only {product.stock} left!
          </Badge>
        )}

        {product.stock === 0 && (
          <div 
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white' }}
          >
            <span className="fw-bold">Out of Stock</span>
          </div>
        )}
      </div>

      <Card.Body className="d-flex flex-column p-2">
        <Card.Title className="h6 mb-1" style={{ minHeight: '2rem', fontSize: '0.85rem', lineHeight: '1.2' }}>
          {product.name}
        </Card.Title>
        <Card.Text className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>{product.size}</Card.Text>

        <div className="d-flex align-items-center mb-2">
          <span className="fw-bold text-success" style={{ fontSize: '0.9rem' }}>₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-muted text-decoration-line-through ms-1" style={{ fontSize: '0.75rem' }}>
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        <div className="mt-auto">
          <Button 
            className="w-100"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{ 
              fontSize: '0.75rem', 
              padding: '0.4rem 0.5rem',
              fontWeight: '600',
              backgroundColor: '#f8d616',
              border: '1px solid #f8d616',
              color: '#000',
              borderRadius: '4px'
            }}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;