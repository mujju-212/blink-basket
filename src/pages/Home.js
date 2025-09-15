import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { CATEGORIES, PRODUCTS } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import CategoryGrid from '../components/product/CategoryGrid';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const navigate = useNavigate();

  const bannerSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=300&fit=crop&q=80',
      title: 'Fresh Groceries',
      subtitle: 'Delivered in 10 minutes',
      buttonText: 'Shop Now'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=300&fit=crop&q=80',
      title: 'Fresh Fruits',
      subtitle: 'Farm to your doorstep',
      buttonText: 'Order Now'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=1200&h=300&fit=crop&q=80',
      title: 'Dairy Fresh',
      subtitle: 'Pure & healthy dairy products',
      buttonText: 'Explore'
    }
  ];

  useEffect(() => {
    setCategories(CATEGORIES);
    setProducts(PRODUCTS.slice(0, 20));
    setLoading(false);
  }, []);

  // Auto-rotate banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerSlides.length]);

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
    <div className="home-page">
      <Container>
        {/* Banner Section */}
        <section className="banner-section my-4">
          <div className="position-relative rounded overflow-hidden shadow">
            <div 
              className="banner-slide position-relative"
              style={{ height: '300px' }}
            >
              <img
                className="w-100 h-100"
                src={bannerSlides[currentBannerIndex].image}
                alt={bannerSlides[currentBannerIndex].title}
                style={{ objectFit: 'cover' }}
              />
              <div className="position-absolute top-50 start-0 translate-middle-y text-white ps-5">
                <h1 className="display-4 fw-bold mb-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                  {bannerSlides[currentBannerIndex].title}
                </h1>
                <p className="fs-5 mb-4" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                  {bannerSlides[currentBannerIndex].subtitle}
                </p>
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/search')}
                >
                  {bannerSlides[currentBannerIndex].buttonText}
                </button>
              </div>
            </div>
            
            {/* Banner Indicators */}
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
              <div className="d-flex gap-2">
                {bannerSlides.map((_, index) => (
                  <button
                    key={index}
                    className={`btn btn-sm rounded-circle ${index === currentBannerIndex ? 'btn-light' : 'btn-outline-light'}`}
                    style={{ width: '12px', height: '12px', padding: 0 }}
                    onClick={() => setCurrentBannerIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section my-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title fw-bold mb-0">Shop by Category</h2>
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/search?category=all')}
            >
              View All
            </button>
          </div>
          <CategoryGrid categories={categories} />
        </section>

        {/* Special Offers Section */}
        <section className="offers-section my-5">
          <h2 className="section-title fw-bold mb-4">Special Offers</h2>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="card h-100 border-0 position-relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=200&fit=crop&q=80" 
                  alt="First Order Offer"
                  className="card-img-top"
                  style={{ height: '150px', objectFit: 'cover' }}
                />
                <div className="card-img-overlay d-flex flex-column justify-content-end text-white" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                  <h5 className="card-title fw-bold">First Order</h5>
                  <h3 className="fw-bold text-warning">20% OFF</h3>
                  <p className="card-text small">Use code: FIRST20</p>
                  <button className="btn btn-warning btn-sm w-50">Shop Now</button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 position-relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop&q=80" 
                  alt="Free Delivery Offer"
                  className="card-img-top"
                  style={{ height: '150px', objectFit: 'cover' }}
                />
                <div className="card-img-overlay d-flex flex-column justify-content-end text-white" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                  <h5 className="card-title fw-bold">Free Delivery</h5>
                  <h3 className="fw-bold text-warning">On ₹999+</h3>
                  <p className="card-text small">No delivery charges</p>
                  <button className="btn btn-warning btn-sm w-50">Order Now</button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 position-relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop&q=80" 
                  alt="Weekend Special"
                  className="card-img-top"
                  style={{ height: '150px', objectFit: 'cover' }}
                />
                <div className="card-img-overlay d-flex flex-column justify-content-end text-white" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                  <h5 className="card-title fw-bold">Weekend Special</h5>
                  <h3 className="fw-bold text-warning">₹100 OFF</h3>
                  <p className="card-text small">On orders above ₹1500</p>
                  <button className="btn btn-warning btn-sm w-50">Grab Deal</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="products-section my-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title fw-bold mb-0">Popular Products</h2>
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/search?category=all')}
            >
              View All
            </button>
          </div>
          <ProductGrid products={products} />
        </section>
      </Container>
    </div>
  );
};

export default Home;