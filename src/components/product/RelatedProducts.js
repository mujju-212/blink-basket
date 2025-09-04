import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import productService from '../../services/productService';
import ProductCard from './ProductCard';

const RelatedProducts = ({ currentProduct, category }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRelatedProducts();
  }, [currentProduct, category]);

  const loadRelatedProducts = async () => {
    try {
      setLoading(true);
      const categoryProducts = productService.getProductsByCategory(category);
      
      // Filter out current product and limit to 4 items
      const filtered = categoryProducts
        .filter(product => product.id !== currentProduct.id)
        .slice(0, 4);
      
      setRelatedProducts(filtered);
    } catch (error) {
      console.error('Error loading related products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <h5 className="mb-0">Related Products</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            {[...Array(4)].map((_, index) => (
              <Col key={index} md={3} className="mb-3">
                <div className="placeholder-glow">
                  <div className="placeholder bg-secondary" style={{ height: '200px', borderRadius: '8px' }}></div>
                  <div className="placeholder col-8 mt-2"></div>
                  <div className="placeholder col-6 mt-1"></div>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white">
        <h5 className="mb-0">
          <i className="fas fa-layer-group me-2 text-primary"></i>
          Related Products
        </h5>
      </Card.Header>
      <Card.Body>
        <Row>
          {relatedProducts.map((product) => (
            <Col key={product.id} md={3} className="mb-3">
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default RelatedProducts;