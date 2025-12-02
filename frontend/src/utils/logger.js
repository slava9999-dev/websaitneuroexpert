/**
 * Centralized logging utility for NeuroExpert
 * Prevents console.log in production and integrates with Sentry
 */

const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';

class Logger {
  /**
   * Log informational messages (only in development)
   */
  log(...args) {
    if (isDevelopment) {
      console.log(...args);
    }
  }

  /**
   * Log errors (always logged, sent to Sentry in production)
   */
  error(...args) {
    if (isDevelopment) {
      console.error(...args);
    }
    
    // Send to Sentry in production
    if (isProduction && window.Sentry) {
      const error = args[0];
      if (error instanceof Error) {
        window.Sentry.captureException(error, {
          extra: { additionalData: args.slice(1) }
        });
      } else {
        window.Sentry.captureMessage(String(error), {
          level: 'error',
          extra: { args }
        });
      }
    }
  }

  /**
   * Log warnings (only in development)
   */
  warn(...args) {
    if (isDevelopment) {
      console.warn(...args);
    }
  }

  /**
   * Log debug information (only in development)
   */
  debug(...args) {
    if (isDevelopment) {
      console.debug(...args);
    }
  }

  /**
   * Log API requests (only in development)
   */
  api(method, url, data) {
    if (isDevelopment) {
      console.log(`🚀 API ${method.toUpperCase()}: ${url}`, data || '');
    }
  }

  /**
   * Log API responses (only in development)
   */
  apiResponse(status, url, data) {
    if (isDevelopment) {
      const emoji = status >= 200 && status < 300 ? '✅' : '❌';
      console.log(`${emoji} API Response ${status}: ${url}`, data || '');
    }
  }

  /**
   * Log performance metrics (only in development)
   */
  performance(label, duration) {
    if (isDevelopment) {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }
  }

  /**
   * Log user interactions (sent to analytics in production)
   */
  interaction(action, data) {
    if (isDevelopment) {
      console.log(`👆 User Interaction: ${action}`, data);
    }
    
    // Send to analytics in production
    if (isProduction && window.ym) {
      window.ym(105459977, 'reachGoal', action, data);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export individual methods for convenience
export const { log, error, warn, debug, api, apiResponse, performance: logPerformance, interaction } = logger;

export default logger;
