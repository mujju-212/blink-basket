import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaShoppingCart, FaBoxes, FaUsers, FaChartLine } from 'react-icons/fa';

const StatsCards = () => {
  const dashboardStats = {
    totalOrders: 248,
    totalProducts: 1250,
    totalUsers: 2847,
    totalRevenue: 125000
  };

  const statsData = [
    {
      title: 'Total Orders',
      value: dashboardStats.totalOrders.toLocaleString(),
      icon: FaShoppingCart,
      color: '#ffd60a',
      borderColor: '#ffd60a',
      growth: '+12.5%',
      subtitle: 'This month'
    },
    {
      title: 'Total Products',
      value: dashboardStats.totalProducts.toLocaleString(),
      icon: FaBoxes,
      color: '#28a745',
      borderColor: '#28a745',
      growth: '+8.2%',
      subtitle: 'In stock'
    },
    {
      title: 'Total Users',
      value: dashboardStats.totalUsers.toLocaleString(),
      icon: FaUsers,
      color: '#17a2b8',
      borderColor: '#17a2b8',
      growth: '+15.3%',
      subtitle: 'Active users'
    },
    {
      title: 'Total Revenue',
      value: `₹${(dashboardStats.totalRevenue / 1000).toFixed(0)}K`,
      icon: FaChartLine,
      color: '#dc3545',
      borderColor: '#dc3545',
      growth: '+18.7%',
      subtitle: 'This month'
    }
  ];

  return (
    <Row className="mb-4">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Col md={3} key={index} className="mb-3">
            <Card 
              className="shadow-sm border-0 h-100 stats-card" 
              style={{ 
                borderRadius: '15px', 
                borderTop: `5px solid ${stat.borderColor}`,
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <Card.Body className="text-center p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <IconComponent size={40} style={{ color: stat.color }} />
                  <span 
                    className="badge"
                    style={{ 
                      backgroundColor: `${stat.color}20`,
                      color: stat.color,
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
                  >
                    {stat.growth}
                  </span>
                </div>
                <h3 style={{ color: '#333', fontWeight: 'bold', fontSize: '2rem', margin: 0 }}>
                  {stat.value}
                </h3>
                <p className="text-muted mb-1" style={{ fontSize: '14px', fontWeight: '500' }}>
                  {stat.title}
                </p>
                <small className="text-muted" style={{ fontSize: '11px' }}>
                  {stat.subtitle}
                </small>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default StatsCards;