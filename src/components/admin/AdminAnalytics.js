import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Table, Form, Modal } from 'react-bootstrap';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useWebSocket } from '../../context/WebSocketContext';
import { useToast } from '../common/ToastSystem';
import { AnimatedCounter } from '../common/LoadingComponents';
import './AdminAnalytics.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalOrders: 0,
      totalRevenue: 0,
      activeUsers: 0,
      conversionRate: 0
    },
    recentOrders: [],
    salesData: [],
    topProducts: [],
    categoryPerformance: [],
    userMetrics: {},
    realtimeData: {
      activeUsers: 0,
      ordersToday: 0,
      revenueToday: 0
    }
  });
  
  const [dateRange, setDateRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [bulkActions, setBulkActions] = useState({
    selectedOrders: new Set(),
    action: ''
  });

  const { addMessageHandler, sendMessage } = useWebSocket();
  const toast = useToast();

  // Load analytics data
  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  // Real-time updates
  useEffect(() => {
    const cleanup = addMessageHandler('admin_analytics_update', (data) => {
      setAnalytics(prev => ({
        ...prev,
        realtimeData: data.realtimeData,
        overview: { ...prev.overview, ...data.overview }
      }));
    });

    // Subscribe to real-time analytics
    sendMessage('subscribe', { channel: 'admin_analytics' });

    return cleanup;
  }, [addMessageHandler, sendMessage]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        toast.showError('Failed to load analytics data');
      }
    } catch (error) {
      console.error('Analytics error:', error);
      toast.showError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle bulk order actions
  const handleBulkAction = async () => {
    if (bulkActions.selectedOrders.size === 0 || !bulkActions.action) {
      toast.showWarning('Please select orders and an action');
      return;
    }

    try {
      const response = await fetch('/api/admin/orders/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderIds: Array.from(bulkActions.selectedOrders),
          action: bulkActions.action
        })
      });

      if (response.ok) {
        toast.showSuccess(`Bulk action completed for ${bulkActions.selectedOrders.size} orders`);
        setBulkActions({ selectedOrders: new Set(), action: '' });
        loadAnalyticsData();
      } else {
        toast.showError('Bulk action failed');
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.showError('Bulk action failed');
    }
  };

  // Chart configurations
  const salesChartConfig = {
    data: {
      labels: analytics.salesData.map(item => item.date),
      datasets: [
        {
          label: 'Revenue',
          data: analytics.salesData.map(item => item.revenue),
          borderColor: '#ffe01b',
          backgroundColor: 'rgba(255, 224, 27, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Orders',
          data: analytics.salesData.map(item => item.orders),
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Revenue (₹)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Orders'
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Sales Performance'
        }
      }
    }
  };

  const categoryChartConfig = {
    data: {
      labels: analytics.categoryPerformance.map(item => item.name),
      datasets: [
        {
          data: analytics.categoryPerformance.map(item => item.revenue),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ],
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'Category Performance'
        }
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'warning',
      confirmed: 'info',
      preparing: 'primary',
      out_for_delivery: 'success',
      delivered: 'success',
      cancelled: 'danger'
    };
    return <Badge bg={statusColors[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="admin-analytics">
      {/* Header */}
      <div className="analytics-header mb-4">
        <Row className="align-items-center">
          <Col>
            <h2 className="mb-0">Analytics Dashboard</h2>
            <small className="text-muted">Real-time insights and performance metrics</small>
          </Col>
          <Col xs="auto">
            <Form.Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="date-range-select"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      {/* Real-time Metrics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="metric-card text-center border-0 shadow-sm">
            <Card.Body>
              <div className="metric-icon text-primary">
                <i className="fas fa-users fa-2x"></i>
              </div>
              <h3 className="metric-value text-primary">
                <AnimatedCounter value={analytics.realtimeData.activeUsers} />
              </h3>
              <p className="metric-label mb-0">Active Users</p>
              <div className="real-time-indicator">
                <span className="pulse-dot"></span>
                Live
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="metric-card text-center border-0 shadow-sm">
            <Card.Body>
              <div className="metric-icon text-success">
                <i className="fas fa-shopping-cart fa-2x"></i>
              </div>
              <h3 className="metric-value text-success">
                <AnimatedCounter value={analytics.realtimeData.ordersToday} />
              </h3>
              <p className="metric-label mb-0">Orders Today</p>
              <small className="text-success">
                <i className="fas fa-arrow-up"></i> +12% vs yesterday
              </small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="metric-card text-center border-0 shadow-sm">
            <Card.Body>
              <div className="metric-icon text-warning">
                <i className="fas fa-rupee-sign fa-2x"></i>
              </div>
              <h3 className="metric-value text-warning">
                ₹<AnimatedCounter value={analytics.realtimeData.revenueToday} />
              </h3>
              <p className="metric-label mb-0">Revenue Today</p>
              <small className="text-success">
                <i className="fas fa-arrow-up"></i> +8% vs yesterday
              </small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="metric-card text-center border-0 shadow-sm">
            <Card.Body>
              <div className="metric-icon text-info">
                <i className="fas fa-percentage fa-2x"></i>
              </div>
              <h3 className="metric-value text-info">
                <AnimatedCounter value={analytics.overview.conversionRate} />%
              </h3>
              <p className="metric-label mb-0">Conversion Rate</p>
              <small className="text-success">
                <i className="fas fa-arrow-up"></i> +2.1% vs last week
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="chart-card border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Sales Performance</h5>
            </Card.Header>
            <Card.Body>
              <Line {...salesChartConfig} />
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="chart-card border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Category Revenue</h5>
            </Card.Header>
            <Card.Body>
              <Doughnut {...categoryChartConfig} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders with Bulk Actions */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Recent Orders</h5>
            </Col>
            <Col xs="auto">
              <div className="bulk-actions d-flex gap-2">
                <Form.Select
                  size="sm"
                  value={bulkActions.action}
                  onChange={(e) => setBulkActions(prev => ({ ...prev, action: e.target.value }))}
                  disabled={bulkActions.selectedOrders.size === 0}
                >
                  <option value="">Bulk Actions</option>
                  <option value="confirm">Confirm Orders</option>
                  <option value="prepare">Mark as Preparing</option>
                  <option value="dispatch">Dispatch Orders</option>
                  <option value="cancel">Cancel Orders</option>
                </Form.Select>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleBulkAction}
                  disabled={bulkActions.selectedOrders.size === 0 || !bulkActions.action}
                >
                  Apply ({bulkActions.selectedOrders.size})
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setBulkActions(prev => ({
                          ...prev,
                          selectedOrders: new Set(analytics.recentOrders.map(order => order.id))
                        }));
                      } else {
                        setBulkActions(prev => ({ ...prev, selectedOrders: new Set() }));
                      }
                    }}
                    checked={bulkActions.selectedOrders.size === analytics.recentOrders.length && analytics.recentOrders.length > 0}
                  />
                </th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={bulkActions.selectedOrders.has(order.id)}
                      onChange={(e) => {
                        const newSelected = new Set(bulkActions.selectedOrders);
                        if (e.target.checked) {
                          newSelected.add(order.id);
                        } else {
                          newSelected.delete(order.id);
                        }
                        setBulkActions(prev => ({ ...prev, selectedOrders: newSelected }));
                      }}
                    />
                  </td>
                  <td className="fw-bold">#{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>{order.itemCount} items</td>
                  <td>₹{order.total}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderModal(true);
                      }}
                    >
                      <i className="fas fa-eye"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Order Details Modal */}
      <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details - #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <h6>Customer Information</h6>
                  <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                </Col>
                <Col md={6}>
                  <h6>Order Information</h6>
                  <p><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</p>
                  <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
                  <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </Col>
              </Row>
              
              <h6>Items</h6>
              <Table size="sm">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.price}</td>
                      <td>₹{item.quantity * item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminAnalytics;