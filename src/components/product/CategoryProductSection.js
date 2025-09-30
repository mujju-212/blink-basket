import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const CategoryProductSection = ({ 
  categoryName, 
  products, 
  showSeeAll = true, 
  maxProducts = 6,
  className = "",
  loading = false
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <section className={`category-products-section my-5 ${className}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title fw-bold mb-0 text-dark">
            {categoryName}
          </h2>
        </div>
        <Row className="g-3">
          {[...Array(maxProducts)].map((_, index) => (
            <Col key={index} xs={6} sm={4} md={3} lg={2}>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-3">
                  <div className="placeholder-glow">
                    <div className="placeholder bg-light rounded" style={{ height: '120px', width: '100%' }}></div>
                    <div className="placeholder col-8 mt-2"></div>
                    <div className="placeholder col-6 mt-1"></div>
                    <div className="placeholder col-4 mt-2"></div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  const displayProducts = products.slice(0, maxProducts);

  return (
    <section className={`category-products-section my-5 ${className}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title fw-bold mb-0 text-dark">
          {categoryName}
          <span className="text-muted fs-6 fw-normal ms-2">
            ({products.length} items)
          </span>
        </h2>
        {showSeeAll && products.length > maxProducts && (
          <Button 
            variant="outline-primary"
            size="sm"
            onClick={() => navigate(`/search?category=${encodeURIComponent(categoryName)}`)}
            className="fw-semibold"
          >
            see all
          </Button>
        )}
      </div>
      
      <Row className="g-3">
        {displayProducts.map((product, index) => (
          <Col key={product.id} xs={6} sm={4} md={3} lg={2}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default CategoryProductSection;