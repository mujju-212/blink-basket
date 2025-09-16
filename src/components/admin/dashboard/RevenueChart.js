import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const RevenueChart = () => {
  // Mock data for revenue trend
  const revenueData = [
    { month: 'Jan', revenue: 15000 },
    { month: 'Feb', revenue: 18000 },
    { month: 'Mar', revenue: 22000 },
    { month: 'Apr', revenue: 19000 },
    { month: 'May', revenue: 25000 },
    { month: 'Jun', revenue: 28000 }
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

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
          Revenue Trend (Last 6 Months)
        </h5>
      </Card.Header>
      <Card.Body>
        <div className="chart-container" style={{ height: '250px', position: 'relative' }}>
          <Row className="h-100 align-items-end">
            {revenueData.map((data, index) => {
              const height = (data.revenue / maxRevenue) * 200;
              return (
                <Col key={index} className="text-center">
                  <div 
                    className="chart-bar mx-auto mb-2"
                    style={{
                      height: `${height}px`,
                      width: '30px',
                      backgroundColor: '#ffd60a',
                      borderRadius: '4px 4px 0 0',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#ffcd00';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#ffd60a';
                      e.target.style.transform = 'scale(1)';
                    }}
                    title={`₹${data.revenue.toLocaleString()}`}
                  ></div>
                  <small className="text-muted fw-bold">{data.month}</small>
                  <br />
                  <small style={{ color: '#28a745', fontWeight: 'bold', fontSize: '10px' }}>
                    ₹{(data.revenue / 1000).toFixed(0)}K
                  </small>
                </Col>
              );
            })}
          </Row>
        </div>
        <div className="mt-3 text-center">
          <small className="text-muted">
            Total Revenue: <span style={{ color: '#28a745', fontWeight: 'bold' }}>
              ₹{revenueData.reduce((sum, data) => sum + data.revenue, 0).toLocaleString()}
            </span>
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RevenueChart;