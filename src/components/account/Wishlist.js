import React from 'react';
import { Card } from 'react-bootstrap';
import { useWishlist } from '../../context/WishlistContext';
import ProductGrid from '../product/ProductGrid';

const Wishlist = () => {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <i className="fas fa-heart fa-4x text-muted mb-3"></i>
          <h5>Your wishlist is empty</h5>
          <p className="text-muted">Add items you love to your wishlist</p>
          <a href="/" className="btn btn-primary">Browse Products</a>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">My Wishlist ({wishlist.length} items)</h5>
      </Card.Header>
      <Card.Body>
        <ProductGrid products={wishlist} />
      </Card.Body>
    </Card>
  );
};

export default Wishlist;