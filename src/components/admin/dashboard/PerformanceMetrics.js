import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const PerformanceMetrics = () => {
  const metrics = [
    {
      title: 'Today\'s Orders',
      value: 12,
      change: '+8.5%',
      trend: 'up',
      color: '#28a745'
    },
    {
      title: 'Average Order Value',
      value: '₹180',
      change: '+12.3%',
      trend: 'up',
      color: '#28a745'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
      color: '#28a745'
    },
    {
      title: 'Delivery Time',
      value: '18 min',
      change: '-2 min',
      trend: 'down',
      color: '#28a745'
    },
    {
      title: 'Return Rate',
      value: '2.1%',
      change: '-0.5%',
      trend: 'down',
      color: '#28a745'
    },
    {
      title: 'Active Users',
      value: 145,
      change: '+5.2%',
      trend: 'up',
      color: '#28a745'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <FaArrowUp size={12} />;
      case 'down':
        return <FaArrowDown size={12} />;
      default:
        return <FaMinus size={12} />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return '#28a745';
      case 'down':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <Card className="shadow-sm border-0" style={{ borderRadius: '15px' }}>
      <Card.Header 
        style={{ 
          backgroundColor: '#fff', 
          borderBottom: '2px solid #ffd60a', 
          borderRadius: '15px 15px 0 0' 
        }}
      >
        <h5 className="mb-0" style={{ color: '#333', fontWeight: 'bold' }}>
          Performance Metrics
        </h5>
      </Card.Header>
      <Card.Body>
        <Row>
          {metrics.map((metric, index) => (
            <Col md={4} key={index} className="mb-3">
              <div 
                className="p-3 h-100" 
                style={{ 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '10px',
                  border: '1px solid #e9ecef'
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <small className="text-muted">{metric.title}</small>
                  <Badge 
                    bg="light" 
                    text="dark"
                    style={{ 
                      color: getTrendColor(metric.trend),
                      backgroundColor: `${getTrendColor(metric.trend)}20`,
                      border: `1px solid ${getTrendColor(metric.trend)}40`
                    }}
                  >
                    {getTrendIcon(metric.trend)} {metric.change}
                  </Badge>
                </div>
                <h4 style={{ color: '#333', fontWeight: 'bold', margin: 0 }}>
                  {metric.value}
                </h4>
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default PerformanceMetrics;