import React, { Component } from 'react';
import { 
  ExclamationCircleIcon, 
  RefreshIcon 
} from '@heroicons/react/outline';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    
    // Optional: Send error to a logging service
    this.logErrorToService(error, errorInfo);

    this.setState({ 
      error, 
      errorInfo 
    });
  }

  logErrorToService = async (error, errorInfo) => {
    try {
      await fetch('/api/log-error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: {
            message: error.toString(),
            stack: error.stack
          },
          componentStack: errorInfo.componentStack
        })
      });
    } catch (logError) {
      console.error('Error logging failed', logError);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null 
    });
  }

  render() {
    if (this.state.hasError) {
      // Error view
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="bg-white shadow-xl rounded-lg p-8">
              <ExclamationCircleIcon className="mx-auto h-20 w-20 text-red-500 mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Something Went Wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We encountered an unexpected error in the application.
                Don't worry, our urban explorers are working on a fix!
              </p>

              {/* Detailed Error Information (only in development) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-gray-100 p-4 rounded-md text-left mb-6 overflow-auto max-h-48">
                  <h3 className="font-semibold mb-2">Error Details:</h3>
                  <p className="text-sm text-red-600">{this.state.error?.toString()}</p>
                  <pre className="text-xs text-gray-700 mt-2">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              )}

              <div className="flex flex-col space-y-4">
                <button 
                  onClick={this.handleRetry}
                  className="rabat-btn-primary py-3 rounded-md text-lg font-semibold flex items-center justify-center"
                >
                  <RefreshIcon className="h-6 w-6 mr-2" />
                  Retry
                </button>
                <a 
                  href="/" 
                  className="rabat-btn-secondary py-3 rounded-md text-lg font-semibold"
                >
                  Return to Home
                </a>
              </div>
            </div>

            {/* Support Information */}
            <div className="text-center text-gray-500 mt-6">
              <p>
                If the problem persists, please contact our support team 
                and provide the error details.
              </p>
              <p className="mt-2">
                Support Email: <a href="mailto:support@rabaturban.com" className="text-rabat-primary-500">support@rabaturban.com</a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;

export const withErrorBoundary = (Component) => {
  return (props) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );
};