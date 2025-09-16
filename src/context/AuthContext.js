// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Add this for compatibility
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setCurrentUser(userData); // Set both for compatibility
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (phone) => {
    const userData = {
      id: Date.now(),
      name: 'John Doe',
      phone: phone,
      email: `user${phone.slice(-4)}@example.com`,
      isAdmin: false
    };
    
    setUser(userData);
    setCurrentUser(userData); // Set both for compatibility
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Show success notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #26a541; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <i class="fas fa-check-circle me-2"></i>
        Welcome back, ${userData.name}!
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
    
    return true;
  };

  const adminLogin = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      const adminData = {
        id: 1,
        name: 'Admin',
        username: username,
        isAdmin: true
      };
      
      setUser(adminData);
      setCurrentUser(adminData); // Set both for compatibility
      localStorage.setItem('user', JSON.stringify(adminData));
      
      // Show success notification
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #26a541; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          <i class="fas fa-check-circle me-2"></i>
          Admin login successful!
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null); // Clear both
    localStorage.removeItem('user');
    
    // Show logout notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; background: #6c757d; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <i class="fas fa-sign-out-alt me-2"></i>
        Logged out successfully
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  };

  const value = {
    user,
    currentUser, // Add this for compatibility
    isAdmin: user?.isAdmin || false, // Add isAdmin computed property
    login,
    adminLogin,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};