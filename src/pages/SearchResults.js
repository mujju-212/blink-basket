import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../utils/constants';
import { useCart } from '../context/CartContext';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  
  const query = searchParams.get('q');
  const category = searchParams.get('category');

  useEffect(() => {
    console.log('Search query:', query);
    console.log('Category filter:', category);
    
    let filteredProducts = [];
    
    if (query) {
      // Search by name or description
      filteredProducts = PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
    } else if (category) {
      // Filter by category
      filteredProducts = PRODUCTS.filter(product => 
        product.category === category
      );
    }
    
    console.log('Filtered results:', filteredProducts.length);
    setResults(filteredProducts);
    setLoading(false);
  }, [query, category]);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h2>
          {query ? `Search Results for "${query}"` : 
           category ? `${category}` : 'Search Results'}
        </h2>
        <p className="text-muted">{results.length} products found</p>
      </div>

      {results.length === 0 ? (
        <Alert variant="warning">
          <h5>No products found</h5>
          <p>Try searching with different keywords or browse our categories.</p>
          <a href="/" className="btn btn-primary">Browse All Products</a>
        </Alert>
      ) : (
        <div className="row g-4">
          {results.map((product) => (
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm">
                <div className="position-relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="card-img-top"
                    style={{ height: '180px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/180x180/f8f9fa/6c757d?text=' + product.name.substring(0, 10);
                    }}
                  />
                  {product.originalPrice && (
                    <span className="badge bg-success position-absolute top-0 start-0 m-2">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title">{product.name}</h6>
                  <p className="text-muted small">{product.size}</p>
                  <div className="mb-2">
                    <span className="fw-bold text-success">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-muted text-decoration-line-through ms-2 small">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <button 
                    className="btn btn-primary btn-sm mt-auto"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default SearchResults;