import React from 'react';
import { Card, Row, Col, ProgressBar } from 'react-bootstrap';

const CategorySales = () => {
  const categoryData = [
    { name: 'Fruits & Vegetables', sales: 45, color: '#28a745', revenue: 25000 },
    { name: 'Dairy & Bakery', sales: 30, color: '#ffd60a', revenue: 18000 },
    { name: 'Snacks & Beverages', sales: 15, color: '#17a2b8', revenue: 12000 },
    { name: 'Personal Care', sales: 10, color: '#dc3545', revenue: 8000 }
  ];

  return (
    <Card className="shadow-sm border-0 h-100" style={{ borderRadius: '15px' }}>
      <Card.Header 
        style={{ 
          backgroundColor: '#fff', 
          borderBottom: '2px solid #ffd60a', 
          borderRadius: '15px 15px 0 0' 
        }}
      >
        <h5 className="mb-0" style={{ color: '#333', fontWeight: 'bold' }}>
          Sales by Category
        </h5>
      </Card.Header>
      <Card.Body>
        {categoryData.map((category, index) => (
          <div key={index} className="mb-4">
            <Row className="align-items-center mb-2">
              <Col xs={6}>
                <span style={{ fontWeight: '500', fontSize: '14px' }}>
                  {category.name}
                </span>
              </Col>
              <Col xs={3} className="text-end">
                <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '12px' }}>
                  ₹{(category.revenue / 1000).toFixed(0)}K
                </span>
              </Col>
              <Col xs={3} className="text-end">
                <span style={{ color: '#666', fontWeight: 'bold', fontSize: '12px' }}>
                  {category.sales}%
                </span>
              </Col>
            </Row>
            <ProgressBar 
              now={category.sales} 
              style={{ 
                height: '8px', 
                borderRadius: '10px',
                backgroundColor: '#f0f0f0'
              }}
            >
              <ProgressBar 
                now={category.sales} 
                style={{ 
                  backgroundColor: category.color,
                  borderRadius: '10px'
                }}
              />
            </ProgressBar>
          </div>
        ))}
        
        <div className="mt-4 pt-3" style={{ borderTop: '1px solid #eee' }}>
          <Row>
            <Col xs={6}>
              <small className="text-muted">Total Categories</small>
              <div style={{ fontWeight: 'bold', color: '#333' }}>4</div>
            </Col>
            <Col xs={6} className="text-end">
              <small className="text-muted">Best Performer</small>
              <div style={{ fontWeight: 'bold', color: '#28a745' }}>Fruits & Vegetables</div>
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CategorySales;