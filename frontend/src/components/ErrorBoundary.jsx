/**
 * Error Boundary component for React
 * Catches JavaScript errors in component tree and displays fallback UI
 */

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console and external services
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.error('🚨 React Error Boundary caught an error:', {
      errorId,
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    // Store error details in state
    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Send error to monitoring service (if configured)
    this.reportError(error, errorInfo, errorId);
  }

  reportError = (error, errorInfo, errorId) => {
    // In production, send to error tracking service
    if (import.meta.env.MODE === 'production') {
      // Example: Send to Sentry, LogRocket, or custom endpoint
      try {
        // Uncomment when error tracking is configured
        // Sentry.captureException(error, { 
        //   contexts: { 
        //     react: { componentStack: errorInfo.componentStack } 
        //   },
        //   tags: { errorId }
        // });

        // Or send to custom endpoint
        fetch('/api/error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            errorId,
            message: error.toString(),
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString(),
          }),
        }).catch(err => console.error('Failed to report error:', err));
      } catch (reportingError) {
        console.error('Error reporting failed:', reportingError);
      }
    }
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.MODE === 'development';

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle className="text-destructive">Что-то пошло не так</CardTitle>
              <CardDescription>
                Произошла непредвиденная ошибка. Мы уже работаем над решением.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Попробовать снова
                </Button>
                <Button onClick={this.handleReload} variant="outline" className="flex-1">
                  Обновить страницу
                </Button>
              </div>
              
              {/* Show error details in development */}
              {isDevelopment && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    Детали ошибки (разработка)
                  </summary>
                  <div className="mt-2 p-3 bg-muted rounded-md text-xs font-mono overflow-auto max-h-48">
                    <div className="mb-2">
                      <strong>Error ID:</strong> {this.state.errorId}
                    </div>
                    <div className="mb-2">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </div>
                    {this.state.error.stack && (
                      <div className="mb-2">
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                      </div>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* User-friendly error message */}
              <div className="text-sm text-muted-foreground text-center">
                Если проблема повторяется, пожалуйста, свяжитесь с нами через форму обратной связи.
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
