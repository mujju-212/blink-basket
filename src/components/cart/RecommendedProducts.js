import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import productService from '../../services/productService';

const RecommendedProducts = () => {
  const { cart, addToCart } = useCart();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (cart.length === 0) return;

    // Get categories from cart items
    const cartCategories = [...new Set(cart.map(item => item.category))];
    
    // Get all products and filter recommendations
    const allProducts = productService.getAllProducts();
    const recommended = allProducts
      .filter(product => 
        cartCategories.includes(product.category) && 
        !cart.some(cartItem => cartItem.id === product.id)
      )
      .slice(0, 4);
    
    setRecommendations(recommended);
  }, [cart]);

  if (recommendations.length === 0) return null;

  return (
    <Card className="mt-4">
      <Card.Header>
        <h6 className="mb-0">You might also like</h6>
      </Card.Header>
      <Card.Body>
        <Row>
          {recommendations.map(product => (
            <Col key={product.id} xs={6} md={3} className="mb-3">
              <div className="text-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-100 rounded mb-2"
                  style={{ height: '100px', objectFit: 'cover' }}
                />
                <h6 className="small mb-1">{product.name}</h6>
                <div className="fw-bold text-success mb-2">₹{product.price}</div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => addToCart(product)}
                  className="w-100"
                >
                  Add
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default RecommendedProducts;