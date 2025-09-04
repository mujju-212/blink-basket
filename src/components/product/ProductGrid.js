import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading = false }) => {
  console.log('ProductGrid received products:', products?.length);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
        <h4 className="text-muted">No products found</h4>
        <p className="text-muted">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <Row className="g-4">
      {products.map((product) => (
        <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
};

export default ProductGrid;