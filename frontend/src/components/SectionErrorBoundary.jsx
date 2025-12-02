/**
 * Section Error Boundary
 * Isolates errors to individual sections instead of crashing the entire app
 */

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logger } from '@/utils/logger';

class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const { sectionName } = this.props;
    
    // Log error
    logger.error(`Section Error in ${sectionName}:`, error, errorInfo);

    // Store error details
    this.setState({
      error,
      errorInfo
    });

    // Send to Sentry
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        tags: {
          section: sectionName,
          errorBoundary: 'section'
        },
        extra: {
          componentStack: errorInfo.componentStack
        }
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      const { sectionName, fallback } = this.props;

      // Use custom fallback if provided
      if (fallback) {
        return typeof fallback === 'function' 
          ? fallback(this.state.error, this.handleRetry)
          : fallback;
      }

      // Default fallback UI
      return (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-2">
                Ошибка в секции {sectionName}
              </h3>
              
              <p className="text-red-700 dark:text-red-300 mb-6">
                Произошла ошибка при загрузке этой секции. Остальная часть сайта работает нормально.
              </p>

              <button
                onClick={this.handleRetry}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Попробовать снова
              </button>

              {import.meta.env.MODE === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-red-800 dark:text-red-200 font-medium mb-2">
                    Детали ошибки (только в development)
                  </summary>
                  <div className="bg-red-100 dark:bg-red-900/30 rounded p-4 text-xs">
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </div>
                    {this.state.error.stack && (
                      <div className="mb-2">
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1 text-xs">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary;
