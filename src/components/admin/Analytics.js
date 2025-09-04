import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table } from 'react-bootstrap';
import orderService from '../../services/orderService';
import productService from '../../services/productService';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  });
  
  const [topProducts, setTopProducts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    // Get order statistics
    const orderStats = orderService.getOrderStats();
    const products = productService.getAllProducts();
    const orders = orderService.getAllOrders();
    
    // Calculate top selling products (mock data for demo)
    const topSellingProducts = products.slice(0, 5).map((product, index) => ({
      ...product,
      soldQuantity: Math.floor(Math.random() * 100) + 10,
      revenue: (Math.floor(Math.random() * 100) + 10) * product.price
    }));

    // Recent activity (mock data)
    const activity = [
      { type: 'order', message: 'New order #BLK001 placed', time: '2 minutes ago' },
      { type: 'product', message: 'Product "Fresh Apples" updated', time: '15 minutes ago' },
      { type: 'user', message: 'New user registered', time: '1 hour ago' },
      { type: 'order', message: 'Order #BLK002 delivered', time: '2 hours ago' }
    ];

    setStats({
      ...orderStats,
      totalProducts: products.length,
      totalUsers: 1234 // Mock data
    });
    
    setTopProducts(topSellingProducts);
    setRecentActivity(activity);
  };

  const StatCard = ({ title, value, icon, color = 'primary', change }) => (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex align-items-center">
          <div className="flex-grow-1">
            <h6 className="text-muted mb-1">{title}</h6>
            <h3 className={`mb-0 text-${color}`}>{value}</h3>
            {change && (
              <small className={`text-${change > 0 ? 'success' : 'danger'}`}>
                <i className={`fas fa-arrow-${change > 0 ? 'up' : 'down'} me-1`}></i>
                {Math.abs(change)}% from last month
              </small>
            )}
          </div>
          <div className={`text-${color} opacity-75`}>
            <i className={`${icon} fa-2x`}></i>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="analytics-dashboard">
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="fas fa-shopping-bag"
            color="primary"
            change={12}
          />
        </Col>
        <Col md={3} className="mb-3">
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon="fas fa-rupee-sign"
            color="success"
            change={8}
          />
        </Col>
        <Col md={3} className="mb-3">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon="fas fa-box"
            color="info"
            change={5}
          />
        </Col>
        <Col md={3} className="mb-3">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon="fas fa-users"
            color="warning"
            change={15}
          />
        </Col>
      </Row>

      <Row>
        {/* Top Products */}
        <Col md={8} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Top Selling Products</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Sold</th>
                    <th>Revenue</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={product.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="rounded me-2"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-semibold">{product.name}</div>
                            <small className="text-muted">₹{product.price}</small>
                          </div>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>
                        <span className="badge bg-primary">{product.soldQuantity}</span>
                      </td>
                      <td className="fw-semibold text-success">₹{product.revenue.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${product.stock > 20 ? 'bg-success' : product.stock > 5 ? 'bg-warning' : 'bg-danger'}`}>
                          {product.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col md={4} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Activity</h5>
            </Card.Header>
            <Card.Body>
              <div className="activity-feed">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="d-flex align-items-start mb-3">
                    <div 
                      className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
                        activity.type === 'order' ? 'bg-primary' :
                        activity.type === 'product' ? 'bg-info' :
                        activity.type === 'user' ? 'bg-success' : 'bg-secondary'
                      }`}
                      style={{ width: '32px', height: '32px', minWidth: '32px' }}
                    >
                      <i className={`fas fa-${
                        activity.type === 'order' ? 'shopping-bag' :
                        activity.type === 'product' ? 'box' :
                        activity.type === 'user' ? 'user' : 'bell'
                      } text-white fa-sm`}></i>                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-1 small">{activity.message}</p>
                      <small className="text-muted">{activity.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-3">
            <Card.Header>
              <h6 className="mb-0">Quick Stats</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small">Pending Orders</span>
                <span className="badge bg-warning">{stats.pendingOrders}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small">Delivered Today</span>
                <span className="badge bg-success">{stats.deliveredOrders}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small">Low Stock Items</span>
                <span className="badge bg-danger">5</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="small">Active Users</span>
                <span className="badge bg-info">234</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;