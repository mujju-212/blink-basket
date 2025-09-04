import React, { useState } from 'react';
import { Card, Row, Col, Button, Form, Modal, Badge } from 'react-bootstrap';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: 'John D.',
      rating: 5,
      comment: 'Excellent quality! Fresh and delivered on time.',
      date: '2024-01-15',
      verified: true
    },
    {
      id: 2,
      user: 'Sarah M.',
      rating: 4,
      comment: 'Good product, but packaging could be better.',
      date: '2024-01-10',
      verified: true
    }
  ]);
  
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < rating ? 'text-warning' : 'text-muted'} ${interactive ? 'cursor-pointer' : ''}`}
        onClick={interactive ? () => onRatingChange(index + 1) : undefined}
      />
    ));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const review = {
      id: Date.now(),
      user: 'You',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      verified: false
    };
    
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    setShowReviewModal(false);
  };

  return (
    <>
      <Card className="mt-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Customer Reviews</h5>
            <Button variant="outline-primary" onClick={() => setShowReviewModal(true)}>
              Write Review
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={4}>
              <div className="text-center">
                <div className="display-4 fw-bold text-warning">{averageRating.toFixed(1)}</div>
                <div className="mb-2">{renderStars(Math.round(averageRating))}</div>
                <div className="text-muted">{reviews.length} reviews</div>
              </div>
            </Col>
            <Col md={8}>
              {[5, 4, 3, 2, 1].map(star => {
                const count = reviews.filter(r => r.rating === star).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                
                return (
                  <div key={star} className="d-flex align-items-center mb-1">
                    <span className="me-2">{star}</span>
                    <i className="fas fa-star text-warning me-2"></i>
                    <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-warning" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-muted small">{count}</span>
                  </div>
                );
              })}
            </Col>
          </Row>

          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="border-bottom pb-3 mb-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <strong>{review.user}</strong>
                      {review.verified && (
                        <Badge bg="success" className="small">Verified Purchase</Badge>
                      )}
                    </div>
                    <div className="small text-muted">{review.date}</div>
                  </div>
                  <div>{renderStars(review.rating)}</div>
                </div>
                <p className="mb-0">{review.comment}</p>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitReview}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <div className="fs-4">
                {renderStars(newReview.rating, true, (rating) => 
                  setNewReview({ ...newReview, rating })
                )}
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Review
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ProductReviews;