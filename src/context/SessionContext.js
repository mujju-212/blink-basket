import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useToast } from '../common/ToastSystem';

const SessionContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  sessionExpiry: null,
  refreshToken: null,
  deviceInfo: {},
  location: null,
  lastActivity: Date.now(),
  preferences: {
    theme: 'light',
    language: 'en',
    notifications: true,
    deliveryPreference: 'fastest',
    currency: 'INR'
  },
  securitySettings: {
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30 * 60 * 1000 // 30 minutes
  }
};

const sessionReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        sessionExpiry: action.payload.expiresAt,
        refreshToken: action.payload.refreshToken,
        lastActivity: Date.now()
      };
    
    case 'LOGOUT':
      // Clear all session data
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return { 
        ...initialState, 
        isLoading: false,
        deviceInfo: state.deviceInfo,
        preferences: state.preferences 
      };
    
    case 'UPDATE_LOCATION':
      return { ...state, location: action.payload };
    
    case 'UPDATE_PREFERENCES':
      const updatedPrefs = { ...state.preferences, ...action.payload };
      localStorage.setItem('userPreferences', JSON.stringify(updatedPrefs));
      return { ...state, preferences: updatedPrefs };
    
    case 'UPDATE_DEVICE_INFO':
      return { ...state, deviceInfo: action.payload };
    
    case 'SESSION_EXPIRED':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null,
        sessionExpiry: null
      };
    
    case 'REFRESH_TOKEN_SUCCESS':
      return {
        ...state,
        sessionExpiry: action.payload.expiresAt,
        lastActivity: Date.now()
      };
    
    case 'UPDATE_ACTIVITY':
      return { ...state, lastActivity: Date.now() };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'UPDATE_USER':
      const updatedUser = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { ...state, user: updatedUser };
    
    default:
      return state;
  }
};

export const SessionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  const toast = useToast();

  // Initialize session from localStorage
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        const user = localStorage.getItem('user');
        const preferences = localStorage.getItem('userPreferences');

        if (preferences) {
          dispatch({
            type: 'UPDATE_PREFERENCES',
            payload: JSON.parse(preferences)
          });
        }

        if (token && user) {
          // Verify token validity
          const tokenData = parseJWT(token);
          if (tokenData && tokenData.exp * 1000 > Date.now()) {
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user: JSON.parse(user),
                expiresAt: tokenData.exp * 1000,
                refreshToken
              }
            });
          } else {
            // Token expired, try refresh
            if (refreshToken) {
              await handleRefreshToken();
            } else {
              dispatch({ type: 'SET_LOADING', payload: false });
            }
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Session initialization error:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeSession();
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (state.sessionExpiry && state.isAuthenticated) {
      const refreshTime = state.sessionExpiry - Date.now() - 5 * 60 * 1000; // 5 minutes before expiry
      
      if (refreshTime > 0) {
        const timer = setTimeout(() => {
          handleRefreshToken();
        }, refreshTime);
        
        return () => clearTimeout(timer);
      }
    }
  }, [state.sessionExpiry, state.isAuthenticated]);

  // Auto-logout on session timeout
  useEffect(() => {
    if (state.isAuthenticated && state.securitySettings.sessionTimeout > 0) {
      const timeoutTime = state.lastActivity + state.securitySettings.sessionTimeout - Date.now();
      
      if (timeoutTime > 0) {
        const timer = setTimeout(() => {
          handleLogout('Session timeout');
        }, timeoutTime);
        
        return () => clearTimeout(timer);
      }
    }
  }, [state.lastActivity, state.isAuthenticated, state.securitySettings.sessionTimeout]);

  // Detect device info
  useEffect(() => {
    const detectDevice = () => {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
      const isDesktop = window.innerWidth > 1024;
      const isTouchDevice = 'ontouchstart' in window;
      
      dispatch({
        type: 'UPDATE_DEVICE_INFO',
        payload: {
          isMobile,
          isTablet,
          isDesktop,
          isTouchDevice,
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight
        }
      });
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  // Activity tracking
  useEffect(() => {
    if (state.isAuthenticated) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      const updateActivity = () => {
        dispatch({ type: 'UPDATE_ACTIVITY' });
      };

      events.forEach(event => {
        document.addEventListener(event, updateActivity, true);
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, updateActivity, true);
        });
      };
    }
  }, [state.isAuthenticated]);

  // Helper functions
  const parseJWT = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const handleRefreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        
        dispatch({
          type: 'REFRESH_TOKEN_SUCCESS',
          payload: {
            expiresAt: parseJWT(data.token).exp * 1000
          }
        });
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      handleLogout('Session expired');
    }
  }, []);

  const handleLogin = useCallback(async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...credentials,
          deviceInfo: state.deviceInfo
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store tokens and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: data.user,
            expiresAt: parseJWT(data.token).exp * 1000,
            refreshToken: data.refreshToken
          }
        });

        toast.showSuccess('Login successful! Welcome back.');
        
        // Log login activity
        logSecurityEvent('login', 'successful');
        
        return { success: true };
      } else {
        const error = await response.json();
        toast.showError(error.message || 'Login failed');
        logSecurityEvent('login', 'failed', error.message);
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.showError('Network error. Please try again.');
      return { success: false, error: 'Network error' };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.deviceInfo, toast]);

  const handleLogout = useCallback(async (reason = 'user_initiated') => {
    try {
      // Notify server
      const token = localStorage.getItem('token');
      if (token) {
        fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason })
        }).catch(() => {
          // Ignore network errors during logout
        });
      }

      dispatch({ type: 'LOGOUT' });
      
      if (reason === 'Session timeout') {
        toast.showWarning('Session expired. Please login again.');
      } else {
        toast.showInfo('Logged out successfully');
      }
      
      logSecurityEvent('logout', reason);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [toast]);

  const updateUserProfile = useCallback(async (updates) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        toast.showSuccess('Profile updated successfully');
        return { success: true };
      } else {
        const error = await response.json();
        toast.showError(error.message || 'Failed to update profile');
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.showError('Network error. Please try again.');
      return { success: false, error: 'Network error' };
    }
  }, [toast]);

  const logSecurityEvent = useCallback((event, status, details = '') => {
    const securityLog = {
      event,
      status,
      details,
      timestamp: new Date().toISOString(),
      deviceInfo: state.deviceInfo,
      userAgent: navigator.userAgent,
      ip: 'client-side' // This would be logged on server side
    };
    
    // In production, send to security monitoring service
    console.log('Security Event:', securityLog);
  }, [state.deviceInfo]);

  const value = {
    ...state,
    login: handleLogin,
    logout: handleLogout,
    updateUserProfile,
    updatePreferences: (preferences) => 
      dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences }),
    updateLocation: (location) => 
      dispatch({ type: 'UPDATE_LOCATION', payload: location }),
    refreshToken: handleRefreshToken,
    logSecurityEvent
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};

// Higher-order component for route protection
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useSession();
    
    if (isLoading) {
      return <div className="loading-spinner">Loading...</div>;
    }
    
    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }
    
    return <Component {...props} />;
  };
};

export default SessionProvider;