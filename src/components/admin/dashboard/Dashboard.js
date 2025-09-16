import React from 'react';
import { Row, Col } from 'react-bootstrap';
import StatsCards from './StatsCards';
import RecentOrders from './RecentOrders';
import RevenueChart from './RevenueChart';
import CategorySales from './CategorySales';
import PerformanceMetrics from './PerformanceMetrics';

const Dashboard = () => {
  return (
    <div>
      <div className="mb-4">
        <h2 style={{ color: '#333', fontWeight: 'bold' }}>Dashboard Overview</h2>
        <p className="text-muted">Monitor your store performance and analytics</p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts and Analytics */}
      <Row className="mb-4">
        <Col lg={8}>
          <RevenueChart />
        </Col>
        <Col lg={4}>
          <CategorySales />
        </Col>
      </Row>

      {/* Performance Metrics */}
      <div className="mb-4">
        <PerformanceMetrics />
      </div>

      {/* Recent Orders */}
      <RecentOrders />
    </div>
  );
};

export default Dashboard;