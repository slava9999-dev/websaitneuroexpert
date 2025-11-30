/**
 * Performance monitoring and optimization utilities
 */

// Core Web Vitals monitoring
export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Performance timing utilities
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
  return result;
};

export const measureAsyncPerformance = async (name, fn) => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
  return result;
};

// Bundle size monitoring
export const logBundleSize = () => {
  if (import.meta.env.MODE === 'development') {
    setTimeout(() => {
      const scripts = document.querySelectorAll('script[src]');
      let totalSize = 0;
      
      scripts.forEach(script => {
        if (script.src.includes('static/js')) {
          // Estimate size (this is approximate)
          const size = script.src.length * 2; // Rough estimate
          totalSize += size;
        }
      });
      
      console.log(`📦 Estimated bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
    }, 1000);
  }
};

// Image lazy loading with intersection observer
export const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
    });
  }
};

// Debounce utility for performance optimization
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle utility for scroll/resize events
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memory usage monitoring (development only)
export const logMemoryUsage = () => {
  if (import.meta.env.MODE === 'development' && 'memory' in performance) {
    const memory = performance.memory;
    console.log('🧠 Memory Usage:', {
      used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
    });
  }
};

// Network performance monitoring
export const logNetworkPerformance = () => {
  if ('navigation' in performance) {
    const navigation = performance.getEntriesByType('navigation')[0];
    console.log('🌐 Network Performance:', {
      'DNS Lookup': `${(navigation.domainLookupEnd - navigation.domainLookupStart).toFixed(2)}ms`,
      'TCP Connection': `${(navigation.connectEnd - navigation.connectStart).toFixed(2)}ms`,
      'Server Response': `${(navigation.responseEnd - navigation.requestStart).toFixed(2)}ms`,
      'DOM Processing': `${(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart).toFixed(2)}ms`,
      'Page Load': `${(navigation.loadEventEnd - navigation.loadEventStart).toFixed(2)}ms`,
      'Total Time': `${(navigation.loadEventEnd - navigation.navigationStart).toFixed(2)}ms`,
    });
  }
};

// Component performance HOC
export const withPerformanceMonitoring = (WrappedComponent, componentName = 'Component') => {
  return (props) => {
    React.useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        console.log(`⏱️ ${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`);
      };
    });

    return <WrappedComponent {...props} />;
  };
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  // Log initial performance metrics
  if (import.meta.env.MODE === 'development') {
    logBundleSize();
    logMemoryUsage();
    logNetworkPerformance();
    
    // Set up periodic memory monitoring
    const memoryInterval = setInterval(logMemoryUsage, 30000); // Every 30 seconds
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      clearInterval(memoryInterval);
    });
  }

  // Initialize lazy loading
  lazyLoadImages();
};

export default {
  reportWebVitals,
  measurePerformance,
  measureAsyncPerformance,
  logBundleSize,
  lazyLoadImages,
  debounce,
  throttle,
  logMemoryUsage,
  logNetworkPerformance,
  withPerformanceMonitoring,
  initPerformanceMonitoring,
};
