import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Card, Tabs, Tab, Alert } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductGrid from '../components/product/ProductGrid';
import ProductReviews from '../components/product/ProductReviews';
import productService from '../services/productService';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);

  // Sample additional images for the product
  const productImages = [
    product?.image,
    'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&h=400&fit=crop'
  ].filter(Boolean);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = productService.getProductById(parseInt(id));
        if (!productData) {
          navigate('/');
          return;
        }
        
        const related = productService.getRelatedProducts(parseInt(id));
        
        setProduct(productData);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error loading product:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

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

  if (!product) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h4>Product not found</h4>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </Container>
    );
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const cartItem = cart.find(item => item.id === product.id);
  const isInCart = !!cartItem;

  const handleAddToCart = () => {
    addToCart(product, selectedQuantity);
    
    // Show notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #26a541; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <i class="fas fa-check-circle me-2"></i>
        ${selectedQuantity} x ${product.name} added to cart!
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  const handleToggleWishlist = () => {
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

  return (
    <Container className="py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Button variant="link" className="p-0 text-decoration-none" onClick={() => navigate('/')}>
              <i className="fas fa-home me-1"></i>Home
            </Button>
          </li>
          <li className="breadcrumb-item">
            <Button 
              variant="link" 
              className="p-0 text-decoration-none" 
              onClick={() => navigate(`/search?category=${encodeURIComponent(product.category)}`)}
            >
              {product.category}
            </Button>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <Row className="mb-5">
        {/* Product Images */}
        <Col md={6}>
          <div className="product-images">
            {/* Main Image */}
            <div className="main-image mb-3 position-relative">
              <img 
                src={productImages[selectedImage] || product.image} 
                alt={product.name}
                className="w-100 rounded shadow"
                style={{ height: '400px', objectFit: 'cover', cursor: 'zoom-in' }}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/400x400/f8f9fa/6c757d?text=${product.name.substring(0, 8)}`;
                }}
              />
              
              {/* Badges */}
              {discount > 0 && (
                <Badge 
                  bg="success" 
                  className="position-absolute top-0 start-0 m-3"
                  style={{ fontSize: '1.1rem', padding: '8px 12px' }}
                >
                  {discount}% OFF
                </Badge>
              )}
              
              {product.stock < 10 && product.stock > 0 && (
                <Badge 
                  bg="warning" 
                  className="position-absolute top-0 end-0 m-3"
                  style={{ fontSize: '0.9rem' }}
                >
                  Only {product.stock} left!
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="thumbnail-images d-flex gap-2">
              {productImages.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`rounded cursor-pointer border ${selectedImage === index ? 'border-primary border-3' : 'border-light'}`}
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>
        </Col>

        {/* Product Info */}
        <Col md={6}>
          <div className="product-details-info">
            <h1 className="mb-3">{product.name}</h1>
            <p className="text-muted mb-3 fs-5">
              <i className="fas fa-weight me-2"></i>
              {product.size}
            </p>
            
            {/* Price Section */}
            <div className="price-section mb-4 p-3 bg-light rounded">
              <div className="d-flex align-items-center mb-2">
                <span className="h2 fw-bold text-success mb-0">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="h5 text-muted text-decoration-line-through ms-3 mb-0">
                      ₹{product.originalPrice}
                    </span>
                    <Badge bg="success" className="ms-2">
                      Save ₹{product.originalPrice - product.price}
                    </Badge>
                  </>
                )}
              </div>
              <small className="text-muted">Inclusive of all taxes</small>
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {product.stock > 0 ? (
                <Alert variant="success" className="py-2 d-flex align-items-center">
                  <i className="fas fa-check-circle me-2"></i>
                  <div>
                    <strong>In Stock</strong> ({product.stock} available)
                    <br />
                    <small>Usually delivered in 10-15 minutes</small>
                  </div>
                </Alert>
              ) : (
                <Alert variant="danger" className="py-2">
                  <i className="fas fa-times-circle me-2"></i>
                  Out of Stock
                </Alert>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-4">
                <label className="form-label fw-semibold">Quantity:</label>
                <div className="d-flex align-items-center gap-3">
                  <div className="quantity-selector d-flex align-items-center border rounded">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="border-0"
                      onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                      disabled={selectedQuantity <= 1}
                    >
                      -
                    </Button>
                    <span className="px-3 py-2 fw-bold">{selectedQuantity}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="border-0"
                      onClick={() => setSelectedQuantity(Math.min(product.stock, selectedQuantity + 1))}
                      disabled={selectedQuantity >= product.stock}
                    >
                      +
                    </Button>
                  </div>
                  <span className="text-muted">
                    Total: <strong>₹{(product.price * selectedQuantity).toLocaleString()}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="d-flex gap-3 mb-4">
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-grow-1"
                style={{ backgroundColor: '#ffe01b', borderColor: '#ffe01b', color: '#000' }}
              >
                <i className="fas fa-shopping-cart me-2"></i>
                {product.stock === 0 ? 'Out of Stock' : 
                 isInCart ? `Update Cart (${cartItem.quantity})` : 'Add to Cart'}
              </Button>
              <Button 
                variant={isInWishlist(product.id) ? "danger" : "outline-secondary"}
                size="lg"
                onClick={handleToggleWishlist}
                style={{ minWidth: '60px' }}
              >
                <i className="fas fa-heart"></i>
              </Button>
              <Button 
                variant="outline-primary"
                size="lg"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      text: product.description,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Product link copied to clipboard!');
                  }
                }}
                style={{ minWidth: '60px' }}
              >
                <i className="fas fa-share-alt"></i>
              </Button>
            </div>

            {/* Quick Features */}
            <div className="quick-features mb-4">
              <div className="row g-2">
                <div className="col-6">
                  <div className="d-flex align-items-center p-2 bg-light rounded">
                    <i className="fas fa-bolt text-warning me-2"></i>
                    <small>10 min delivery</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center p-2 bg-light rounded">
                    <i className="fas fa-undo text-success me-2"></i>
                    <small>Easy returns</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center p-2 bg-light rounded">
                    <i className="fas fa-shield-alt text-primary me-2"></i>
                    <small>Quality assured</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center p-2 bg-light rounded">
                    <i className="fas fa-truck text-info me-2"></i>
                    <small>Free delivery ₹99+</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <Card className="border-2 border-success">
              <Card.Body>
                               <h6 className="mb-3 text-success">
                  <i className="fas fa-shipping-fast me-2"></i>
                  Delivery Information
                </h6>
                <div className="delivery-options">
                  <div className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-clock text-success me-2"></i>
                      <div>
                        <strong>Express Delivery</strong>
                        <div className="small text-muted">10-15 minutes</div>
                      </div>
                    </div>
                    <Badge bg="success">FREE</Badge>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-truck text-success me-2"></i>
                      <div>
                        <strong>Standard Delivery</strong>
                        <div className="small text-muted">30-45 minutes</div>
                      </div>
                    </div>
                    <Badge bg="success">FREE</Badge>
                  </div>
                  <div className="small text-muted mt-2">
                    <i className="fas fa-map-marker-alt me-1"></i>
                    Delivering to your current location
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Product Details Tabs */}
      <Row className="mb-5">
        <Col>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="description" title="Description">
              <Card>
                <Card.Body>
                  <h5 className="mb-3">Product Description</h5>
                  <p className="mb-4">{product.description}</p>
                  
                  <Row>
                    <Col md={6}>
                      <h6 className="mb-3">Key Features:</h6>
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <i className="fas fa-check text-success me-2"></i>
                          Fresh and high quality
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-check text-success me-2"></i>
                          Carefully sourced and selected
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-check text-success me-2"></i>
                          Delivered fresh to your doorstep
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-check text-success me-2"></i>
                          Best price guarantee
                        </li>
                      </ul>
                    </Col>
                    <Col md={6}>
                      <h6 className="mb-3">Storage Instructions:</h6>
                      <div className="bg-light p-3 rounded">
                        <p className="mb-2">
                          <i className="fas fa-thermometer-half text-info me-2"></i>
                          Store in a cool, dry place
                        </p>
                        <p className="mb-2">
                          <i className="fas fa-snowflake text-primary me-2"></i>
                          Refrigerate after opening
                        </p>
                        <p className="mb-0">
                          <i className="fas fa-calendar-alt text-warning me-2"></i>
                          Best before date on package
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
            
            <Tab eventKey="nutrition" title="Nutrition Info">
              <Card>
                <Card.Body>
                  <h5 className="mb-3">Nutritional Information</h5>
                  <p className="text-muted mb-4">Per {product.size} serving</p>
                  
                  <Row>
                    <Col md={6}>
                      <div className="nutrition-table">
                        <div className="d-flex justify-content-between border-bottom py-2">
                          <span>Energy</span>
                          <strong>52 kcal</strong>
                        </div>
                        <div className="d-flex justify-content-between border-bottom py-2">
                          <span>Protein</span>
                          <strong>1.3g</strong>
                        </div>
                        <div className="d-flex justify-content-between border-bottom py-2">
                          <span>Carbohydrates</span>
                          <strong>14g</strong>
                        </div>
                        <div className="d-flex justify-content-between py-2">
                          <span>Fat</span>
                          <strong>0.2g</strong>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="nutrition-table">
                        <div className="d-flex justify-content-between border-bottom py-2">
                          <span>Fiber</span>
                          <strong>2.4g</strong>
                        </div>
                        <div className="d-flex justify-content-between border-bottom py-2">
                          <span>Sugar</span>
                          <strong>10g</strong>
                        </div>
                        <div className="d-flex justify-content-between border-bottom py-2">
                          <span>Sodium</span>
                          <strong>1mg</strong>
                        </div>
                        <div className="d-flex justify-content-between py-2">
                          <span>Vitamin C</span>
                          <strong>4.6mg</strong>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
            
            <Tab eventKey="delivery" title="Delivery & Returns">
              <Card>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h5 className="mb-3">Delivery Options</h5>
                      <div className="delivery-info">
                        <div className="d-flex justify-content-between align-items-center p-3 border rounded mb-3">
                          <div>
                            <strong className="text-success">Express Delivery</strong>
                            <div className="text-muted small">10-15 minutes</div>
                            <div className="small">Available 24/7</div>
                          </div>
                          <Badge bg="success">FREE</Badge>
                        </div>
                        <div className="d-flex justify-content-between align-items-center p-3 border rounded mb-3">
                          <div>
                            <strong>Standard Delivery</strong>
                            <div className="text-muted small">30-45 minutes</div>
                            <div className="small">Available 6 AM - 11 PM</div>
                          </div>
                          <Badge bg="success">FREE</Badge>
                        </div>
                        <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                          <div>
                            <strong>Scheduled Delivery</strong>
                            <div className="text-muted small">Choose your time slot</div>
                            <div className="small">Next day delivery</div>
                          </div>
                          <span className="fw-bold">₹29</span>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <h5 className="mb-3">Return Policy</h5>
                      <div className="return-policy">
                        <div className="mb-3 p-3 bg-light rounded">
                          <h6 className="text-success mb-2">
                            <i className="fas fa-undo me-2"></i>
                            Easy Returns
                          </h6>
                          <ul className="list-unstyled mb-0">
                            <li className="mb-1">✓ Return within 24 hours</li>
                            <li className="mb-1">✓ No questions asked for fresh products</li>
                            <li className="mb-1">✓ Full refund or replacement</li>
                            <li>✓ Quality guarantee on all items</li>
                          </ul>
                        </div>
                        
                        <h6 className="mb-2">Contact Support</h6>
                        <div className="contact-info">
                          <p className="mb-1">
                            <i className="fas fa-phone text-primary me-2"></i>
                            <strong>1800-123-4567</strong>
                          </p>
                          <p className="mb-1">
                            <i className="fas fa-envelope text-primary me-2"></i>
                            support@blinkit.com
                          </p>
                          <p className="mb-0">
                            <i className="fas fa-clock text-primary me-2"></i>
                            24/7 Customer Support
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Reviews Section */}
      <ProductReviews productId={product.id} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>
              <i className="fas fa-layer-group me-2 text-primary"></i>
              Related Products
            </h3>
            <Button 
              variant="outline-primary"
              onClick={() => navigate(`/search?category=${encodeURIComponent(product.category)}`)}
            >
              View All in {product.category}
            </Button>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      )}

      {/* Recently Viewed Products */}
      <section className="mt-5">
        <Card className="bg-light border-0">
          <Card.Body className="text-center py-4">
            <h4 className="mb-3">Continue Shopping</h4>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button 
                variant="outline-primary" 
                onClick={() => navigate('/')}
                className="d-flex align-items-center"
              >
                <i className="fas fa-home me-2"></i>
                Browse All Categories
              </Button>
              <Button 
                variant="outline-success" 
                onClick={() => navigate('/cart')}
                className="d-flex align-items-center"
              >
                <i className="fas fa-shopping-cart me-2"></i>
                View Cart ({cart.length})
              </Button>
              <Button 
                variant="outline-info" 
                onClick={() => navigate('/account/wishlist')}
                className="d-flex align-items-center"
              >
                <i className="fas fa-heart me-2"></i>
                My Wishlist
              </Button>
            </div>
          </Card.Body>
        </Card>
      </section>
    </Container>
  );
};

export default ProductDetails;