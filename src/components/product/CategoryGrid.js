import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CategoryCard from './CategoryCard';

const CategoryGrid = ({ categories }) => {
  console.log('CategoryGrid received categories:', categories?.length);

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
        <h4 className="text-muted">No categories found</h4>
        <p className="text-muted">Categories will appear here</p>
      </div>
    );
  }

  return (
    <Row className="g-4">
      {categories.map((category) => (
        <Col key={category.id} xs={6} sm={4} md={3} lg={2}>
          <CategoryCard category={category} />
        </Col>
      ))}
    </Row>
  );
};

export default CategoryGrid;