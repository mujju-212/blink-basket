// src/components/product/CategoryCard.js
import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/search?category=${encodeURIComponent(category.name)}`);
  };

  return (
    <Card 
      className="text-center h-100 category-card shadow-sm border-0"
      onClick={handleCategoryClick}
      style={{ 
        cursor: 'pointer', 
        transition: 'all 0.2s ease',
        minHeight: '130px', // Compact height
        borderRadius: '12px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}
    >
      <Card.Body className="d-flex flex-column align-items-center justify-content-center p-2">
<div 
  className="category-icon mb-2"
  style={{ 
    width: '80px',  // Increased from 50px
    height: '80px', // Increased from 50px
    borderRadius: '12px', // Slightly larger border radius
    overflow: 'hidden',
    backgroundColor: '#f8f9fa'
  }}
>
  <img 
    src={category.image} 
    alt={category.name}
    className="w-100 h-100"
    style={{ objectFit: 'cover' }}
    onError={(e) => {
      e.target.src = `https://via.placeholder.com/80x80/ffe01b/000000?text=${category.name.charAt(0)}`;
    }}
  />
</div>
        <Card.Title 
          className="mb-0 text-center" 
          style={{ 
            fontSize: '0.75rem', // Smaller font
            fontWeight: '600',
            lineHeight: '1.2',
            color: '#333'
          }}
        >
          {category.name}
        </Card.Title>
      </Card.Body>
    </Card>
  );
};

export default CategoryCard;