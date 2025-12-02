/**
 * Web Vitals monitoring and reporting
 * Tracks Core Web Vitals and sends to Sentry/Analytics
 */

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import * as Sentry from '@sentry/react';
import { logger } from './logger';

/**
 * Report Web Vital metric to Sentry and console
 */
function reportMetric(metric) {
  const { name, value, rating, delta, id } = metric;
  
  // Log in development
  logger.debug(`Web Vital - ${name}:`, {
    value: `${value.toFixed(2)}ms`,
    rating,
    delta: `${delta.toFixed(2)}ms`,
    id
  });

  // Send to Sentry in production
  if (import.meta.env.PROD && window.Sentry) {
    Sentry.captureMessage(`Web Vital: ${name}`, {
      level: rating === 'good' ? 'info' : rating === 'needs-improvement' ? 'warning' : 'error',
      tags: {
        metric_name: name,
        metric_rating: rating
      },
      extra: {
        value,
        delta,
        id,
        navigationType: metric.navigationType
      }
    });
  }

  // Send to Yandex.Metrika
  if (window.ym) {
    window.ym(105459977, 'reachGoal', `WEB_VITAL_${name}`, {
      value: Math.round(value),
      rating
    });
  }
}

/**
 * Initialize Web Vitals monitoring
 */
export function initWebVitals() {
  // Largest Contentful Paint (LCP)
  // Measures loading performance
  // Good: < 2.5s, Needs Improvement: 2.5s - 4s, Poor: > 4s
  getLCP(reportMetric);

  // First Input Delay (FID)
  // Measures interactivity
  // Good: < 100ms, Needs Improvement: 100ms - 300ms, Poor: > 300ms
  getFID(reportMetric);

  // Cumulative Layout Shift (CLS)
  // Measures visual stability
  // Good: < 0.1, Needs Improvement: 0.1 - 0.25, Poor: > 0.25
  getCLS(reportMetric);

  // First Contentful Paint (FCP)
  // Measures perceived load speed
  // Good: < 1.8s, Needs Improvement: 1.8s - 3s, Poor: > 3s
  getFCP(reportMetric);

  // Time to First Byte (TTFB)
  // Measures server response time
  // Good: < 800ms, Needs Improvement: 800ms - 1800ms, Poor: > 1800ms
  getTTFB(reportMetric);

  logger.log('✅ Web Vitals monitoring initialized');
}

/**
 * Get performance metrics summary
 */
export function getPerformanceSummary() {
  if (!window.performance) {
    return null;
  }

  const navigation = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');

  return {
    // Navigation timing
    dns: navigation?.domainLookupEnd - navigation?.domainLookupStart,
    tcp: navigation?.connectEnd - navigation?.connectStart,
    ttfb: navigation?.responseStart - navigation?.requestStart,
    download: navigation?.responseEnd - navigation?.responseStart,
    domInteractive: navigation?.domInteractive,
    domComplete: navigation?.domComplete,
    loadComplete: navigation?.loadEventEnd,

    // Paint timing
    fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
    
    // Memory (if available)
    memory: performance.memory ? {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
    } : null
  };
}

/**
 * Log performance summary (development only)
 */
export function logPerformanceSummary() {
  if (import.meta.env.MODE !== 'development') return;

  const summary = getPerformanceSummary();
  if (!summary) return;

  console.group('📊 Performance Summary');
  console.log('DNS Lookup:', `${summary.dns?.toFixed(2)}ms`);
  console.log('TCP Connection:', `${summary.tcp?.toFixed(2)}ms`);
  console.log('TTFB:', `${summary.ttfb?.toFixed(2)}ms`);
  console.log('Download:', `${summary.download?.toFixed(2)}ms`);
  console.log('DOM Interactive:', `${summary.domInteractive?.toFixed(2)}ms`);
  console.log('DOM Complete:', `${summary.domComplete?.toFixed(2)}ms`);
  console.log('Load Complete:', `${summary.loadComplete?.toFixed(2)}ms`);
  console.log('FCP:', `${summary.fcp?.toFixed(2)}ms`);
  
  if (summary.memory) {
    console.log('Memory Used:', `${summary.memory.used}MB / ${summary.memory.total}MB`);
  }
  
  console.groupEnd();
}

export default {
  initWebVitals,
  getPerformanceSummary,
  logPerformanceSummary
};
