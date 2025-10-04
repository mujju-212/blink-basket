import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from './SessionContext';
import { useToast } from '../components/common/ToastSystem';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useSession();
  const toast = useToast();
  const ws = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [subscribedChannels, setSubscribedChannels] = useState(new Set());
  const [messageHandlers, setMessageHandlers] = useState(new Map());
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_INTERVAL = 3000;
  const HEARTBEAT_INTERVAL = 30000;

  // Initialize WebSocket connection
  const connect = useCallback(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    try {
      const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';
      const token = localStorage.getItem('token');
      
      ws.current = new WebSocket(`${wsUrl}?token=${token}&userId=${user.id}`);
      
      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('connected');
        setReconnectAttempts(0);
        
        // Start heartbeat
        startHeartbeat();
        
        // Re-subscribe to channels
        subscribedChannels.forEach(channel => {
          subscribe(channel);
        });
        
        toast.showSuccess('Real-time connection established', { duration: 2000 });
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setConnectionStatus('disconnected');
        stopHeartbeat();
        
        // Attempt reconnection if not intentional closure
        if (event.code !== 1000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          scheduleReconnect();
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
        toast.showError('Connection error. Retrying...', { duration: 3000 });
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionStatus('error');
    }
  }, [isAuthenticated, user, reconnectAttempts, subscribedChannels, toast]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close(1000, 'Client disconnect');
      ws.current = null;
    }
    stopHeartbeat();
    clearReconnectTimeout();
  }, []);

  // Schedule reconnection
  const scheduleReconnect = useCallback(() => {
    clearReconnectTimeout();
    
    const delay = Math.min(RECONNECT_INTERVAL * Math.pow(2, reconnectAttempts), 30000);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      setReconnectAttempts(prev => prev + 1);
      connect();
    }, delay);
  }, [connect, reconnectAttempts]);

  // Clear reconnect timeout
  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  // Start heartbeat
  const startHeartbeat = useCallback(() => {
    heartbeatIntervalRef.current = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        sendMessage('ping', {});
      }
    }, HEARTBEAT_INTERVAL);
  }, []);

  // Stop heartbeat
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // Send message
  const sendMessage = useCallback((type, payload, channel = null) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const message = {
        type,
        payload,
        channel,
        timestamp: Date.now(),
        userId: user?.id
      };
      
      ws.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, [user?.id]);

  // Subscribe to channel
  const subscribe = useCallback((channel) => {
    setSubscribedChannels(prev => new Set([...prev, channel]));
    return sendMessage('subscribe', { channel });
  }, [sendMessage]);

  // Unsubscribe from channel
  const unsubscribe = useCallback((channel) => {
    setSubscribedChannels(prev => {
      const newSet = new Set(prev);
      newSet.delete(channel);
      return newSet;
    });
    return sendMessage('unsubscribe', { channel });
  }, [sendMessage]);

  // Add message handler
  const addMessageHandler = useCallback((type, handler) => {
    setMessageHandlers(prev => {
      const newMap = new Map(prev);
      if (!newMap.has(type)) {
        newMap.set(type, new Set());
      }
      newMap.get(type).add(handler);
      return newMap;
    });

    // Return cleanup function
    return () => {
      setMessageHandlers(prev => {
        const newMap = new Map(prev);
        if (newMap.has(type)) {
          newMap.get(type).delete(handler);
          if (newMap.get(type).size === 0) {
            newMap.delete(type);
          }
        }
        return newMap;
      });
    };
  }, []);

  // Handle incoming messages
  const handleMessage = useCallback((data) => {
    const { type, payload, channel } = data;

    // Handle built-in message types
    switch (type) {
      case 'pong':
        // Heartbeat response
        break;
        
      case 'order_update':
        handleOrderUpdate(payload);
        break;
        
      case 'inventory_update':
        handleInventoryUpdate(payload);
        break;
        
      case 'notification':
        handleNotification(payload);
        break;
        
      case 'admin_broadcast':
        handleAdminBroadcast(payload);
        break;
        
      default:
        // Execute custom handlers
        if (messageHandlers.has(type)) {
          messageHandlers.get(type).forEach(handler => {
            try {
              handler(payload, channel);
            } catch (error) {
              console.error(`Error in message handler for ${type}:`, error);
            }
          });
        }
    }
  }, [messageHandlers]);

  // Handle order updates
  const handleOrderUpdate = useCallback((payload) => {
    const { orderId, status, estimatedDelivery } = payload;
    
    switch (status) {
      case 'confirmed':
        toast.showSuccess(`Order #${orderId} confirmed!`, {
          action: {
            label: 'Track Order',
            handler: () => window.location.href = `/orders/${orderId}`
          }
        });
        break;
        
      case 'preparing':
        toast.showInfo(`Order #${orderId} is being prepared`);
        break;
        
      case 'out_for_delivery':
        toast.showInfo(`Order #${orderId} is out for delivery`, {
          action: {
            label: 'Track Live',
            handler: () => window.location.href = `/track/${orderId}`
          }
        });
        break;
        
      case 'delivered':
        toast.showSuccess(`Order #${orderId} delivered successfully!`, {
          action: {
            label: 'Rate Order',
            handler: () => window.location.href = `/orders/${orderId}/rate`
          }
        });
        break;
        
      case 'cancelled':
        toast.showWarning(`Order #${orderId} has been cancelled`);
        break;
    }

    // Trigger custom event for order update
    window.dispatchEvent(new CustomEvent('orderUpdate', {
      detail: { orderId, status, estimatedDelivery }
    }));
  }, [toast]);

  // Handle inventory updates
  const handleInventoryUpdate = useCallback((payload) => {
    const { productId, stock, isLowStock } = payload;
    
    if (isLowStock) {
      // Only show if user has this product in cart/wishlist
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      const isInCartOrWishlist = cartItems.some(item => item.id === productId) ||
                                wishlistItems.includes(productId);
      
      if (isInCartOrWishlist) {
        toast.showWarning(`Low stock alert: Only ${stock} items left`, {
          action: {
            label: 'Order Now',
            handler: () => window.location.href = `/product/${productId}`
          }
        });
      }
    }

    // Trigger custom event for inventory update
    window.dispatchEvent(new CustomEvent('inventoryUpdate', {
      detail: { productId, stock, isLowStock }
    }));
  }, [toast]);

  // Handle notifications
  const handleNotification = useCallback((payload) => {
    const { title, message, type, action } = payload;
    
    const toastAction = action ? {
      label: action.label,
      handler: () => {
        if (action.url) {
          window.location.href = action.url;
        } else if (action.callback) {
          action.callback();
        }
      }
    } : undefined;

    switch (type) {
      case 'promotion':
        toast.showInfo(message, { title, action: toastAction });
        break;
      case 'warning':
        toast.showWarning(message, { title, action: toastAction });
        break;
      case 'success':
        toast.showSuccess(message, { title, action: toastAction });
        break;
      default:
        toast.showInfo(message, { title, action: toastAction });
    }
  }, [toast]);

  // Handle admin broadcasts
  const handleAdminBroadcast = useCallback((payload) => {
    const { message, type, priority } = payload;
    
    if (priority === 'high') {
      toast.showWarning(`📢 ${message}`, { duration: 8000 });
    } else {
      toast.showInfo(`📢 ${message}`, { duration: 6000 });
    }
  }, [toast]);

  // Connect on authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, user, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearReconnectTimeout();
      stopHeartbeat();
      disconnect();
    };
  }, [clearReconnectTimeout, stopHeartbeat, disconnect]);

  const value = {
    connectionStatus,
    subscribedChannels: Array.from(subscribedChannels),
    sendMessage,
    subscribe,
    unsubscribe,
    addMessageHandler,
    reconnect: connect,
    disconnect
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hooks for specific functionalities
export const useOrderTracking = (orderId) => {
  const { subscribe, unsubscribe, addMessageHandler } = useWebSocket();
  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    if (orderId) {
      const channel = `order_${orderId}`;
      subscribe(channel);

      const cleanup = addMessageHandler('order_update', (payload) => {
        if (payload.orderId === orderId) {
          setOrderStatus(payload);
        }
      });

      return () => {
        unsubscribe(channel);
        cleanup();
      };
    }
  }, [orderId, subscribe, unsubscribe, addMessageHandler]);

  return orderStatus;
};

export const useInventoryTracking = (productIds) => {
  const { subscribe, unsubscribe, addMessageHandler } = useWebSocket();
  const [inventory, setInventory] = useState({});

  useEffect(() => {
    if (productIds?.length > 0) {
      productIds.forEach(productId => {
        subscribe(`inventory_${productId}`);
      });

      const cleanup = addMessageHandler('inventory_update', (payload) => {
        if (productIds.includes(payload.productId)) {
          setInventory(prev => ({
            ...prev,
            [payload.productId]: payload
          }));
        }
      });

      return () => {
        productIds.forEach(productId => {
          unsubscribe(`inventory_${productId}`);
        });
        cleanup();
      };
    }
  }, [productIds, subscribe, unsubscribe, addMessageHandler]);

  return inventory;
};

export default WebSocketProvider;