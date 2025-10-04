import React, { Suspense, lazy } from 'react';
import { SkeletonLoader } from './LoadingComponents';

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0
    };
    this.initializeMetrics();
  }

  initializeMetrics() {
    // Measure page load time
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart;
      this.sendMetrics();
    });

    // Web Vitals
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntriesByName('first-contentful-paint');
        if (entries.length > 0) {
          this.metrics.firstContentfulPaint = entries[0].startTime;
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          this.metrics.largestContentfulPaint = entries[entries.length - 1].startTime;
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          this.metrics.firstInputDelay = entries[0].processingStart - entries[0].startTime;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.metrics.cumulativeLayoutShift = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  sendMetrics() {
    // Send to analytics service
    console.log('Performance Metrics:', this.metrics);
    
    // In production, send to your analytics service
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics: this.metrics,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
          url: window.location.href
        })
      }).catch(() => {
        // Ignore errors for analytics
      });
    }
  }

  measureResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    const slowResources = resources.filter(resource => resource.duration > 1000);
    
    if (slowResources.length > 0) {
      console.warn('Slow resources detected:', slowResources);
    }
    
    return resources;
  }
}

// Code splitting utility
export const createLazyComponent = (importFunc, fallback = <SkeletonLoader height="200px" />) => {
  const LazyComponent = lazy(importFunc);
  
  return (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Lazy load common components
export const LazyHome = createLazyComponent(() => import('../../pages/Home'));
export const LazyProductDetails = createLazyComponent(() => import('../../pages/ProductDetails'));
export const LazyCart = createLazyComponent(() => import('../../pages/Cart'));
export const LazyCheckout = createLazyComponent(() => import('../../pages/Checkout'));
export const LazyAccount = createLazyComponent(() => import('../../pages/Account'));
export const LazyAdmin = createLazyComponent(() => import('../../pages/Admin'));

// Bundle analyzer helper
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    import('webpack-bundle-analyzer').then(({ BundleAnalyzerPlugin }) => {
      console.log('Bundle analyzer available');
    });
  }
};

// Memory usage monitor
export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memInfo = performance.memory;
    const memoryUsage = {
      usedJSHeapSize: (memInfo.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
      totalJSHeapSize: (memInfo.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
      jsHeapSizeLimit: (memInfo.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
    };
    
    console.log('Memory Usage:', memoryUsage);
    
    // Alert if memory usage is high
    const usagePercentage = (memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100;
    if (usagePercentage > 80) {
      console.warn('High memory usage detected:', usagePercentage.toFixed(2) + '%');
    }
    
    return memoryUsage;
  }
};

// Resource preloader
export const preloadResources = (resources) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource;
    document.head.appendChild(link);
  });
};

// Critical CSS inliner
export const inlineCriticalCSS = (css) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Image optimization utility
export const optimizeImageUrl = (url, width, height, quality = 85) => {
  if (!url) return '';
  
  const urlObj = new URL(url, window.location.origin);
  urlObj.searchParams.set('w', width);
  if (height) urlObj.searchParams.set('h', height);
  urlObj.searchParams.set('q', quality);
  urlObj.searchParams.set('auto', 'format,compress');
  
  return urlObj.toString();
};

// Cache management
export class CacheManager {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100;
    this.ttl = 5 * 60 * 1000; // 5 minutes
  }

  set(key, value, customTTL = null) {
    const expiryTime = Date.now() + (customTTL || this.ttl);
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      value,
      expiryTime
    });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiryTime) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Debounce utility for performance
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Throttle utility for performance
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Performance observer for custom metrics
export const observePerformance = (callback) => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      callback(entries);
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
    
    return () => observer.disconnect();
  }
  
  return () => {};
};

// Initialize performance monitoring
export const initializePerformanceMonitoring = () => {
  const monitor = new PerformanceMonitor();
  
  // Monitor memory usage every 30 seconds
  setInterval(monitorMemoryUsage, 30000);
  
  // Log slow operations
  observePerformance((entries) => {
    const slowEntries = entries.filter(entry => entry.duration > 100);
    if (slowEntries.length > 0) {
      console.log('Slow operations detected:', slowEntries);
    }
  });
  
  return monitor;
};

export default {
  PerformanceMonitor,
  createLazyComponent,
  CacheManager,
  optimizeImageUrl,
  preloadResources,
  monitorMemoryUsage,
  debounce,
  throttle,
  initializePerformanceMonitoring
};