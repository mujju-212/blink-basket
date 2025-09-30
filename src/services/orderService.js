class OrderService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    const storedOrders = localStorage.getItem('orders');
    if (!storedOrders) {
      localStorage.setItem('orders', JSON.stringify([]));
    }
  }

  getAllOrders() {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  }

  getOrderById(id) {
    const orders = this.getAllOrders();
    return orders.find(order => order.id === id);
  }

  getUserOrders(userPhone) {
    const orders = this.getAllOrders();
    return orders.filter(order => order.phone === userPhone);
  }

  createOrder(orderData) {
    const orders = this.getAllOrders();
    const newOrder = {
      id: this.generateOrderId(),
      ...orderData,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      paymentStatus: orderData.paymentStatus || 'Completed',
      deliveryFee: orderData.deliveryFee || 20,
      timeline: [
        { status: 'Order Placed', time: new Date().toLocaleTimeString(), completed: true },
        { status: 'Order Confirmed', time: '', completed: false },
        { status: 'Preparing', time: '', completed: false },
        { status: 'Out for Delivery', time: '', completed: false },
        { status: 'Delivered', time: '', completed: false }
      ]
    };
    
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    return newOrder;
  }

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getAllOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      const order = orders[orderIndex];
      order.status = newStatus;
      
      // Update timeline based on status
      const currentTime = new Date().toLocaleTimeString();
      const currentDate = new Date().toLocaleDateString();
      
      switch(newStatus) {
        case 'confirmed':
          order.timeline[1].completed = true;
          order.timeline[1].time = currentTime;
          break;
        case 'preparing':
          order.timeline[1].completed = true;
          order.timeline[2].completed = true;
          order.timeline[2].time = currentTime;
          if (!order.timeline[1].time) order.timeline[1].time = currentTime;
          break;
        case 'out_for_delivery':
          order.timeline.slice(0, 4).forEach((step, index) => {
            step.completed = true;
            if (!step.time) step.time = currentTime;
          });
          order.timeline[3].time = currentTime;
          break;
        case 'delivered':
          order.timeline.forEach((step, index) => {
            step.completed = true;
            if (!step.time) step.time = currentTime;
          });
          order.timeline[4].time = currentTime;
          break;
        case 'cancelled':
          // Add cancelled status to timeline
          order.timeline.push({
            status: 'Order Cancelled',
            time: currentTime,
            completed: true
          });
          break;
        default:
          break;
      }
      
      localStorage.setItem('orders', JSON.stringify(orders));
      return order;
    }
    
    return null;
  }

  generateOrderId() {
    return 'BLK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  getOrderStats() {
    const orders = this.getAllOrders();
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    return {
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      deliveredOrders: orders.filter(o => o.status === 'delivered').length
    };
  }
}

export default new OrderService();