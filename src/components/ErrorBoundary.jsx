import { Component } from 'react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 */
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
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Store error details in state
    this.setState({
      error,
      errorInfo
    });

    // Optionally send error to monitoring service (e.g., Sentry)
    if (process.env.REACT_APP_SENTRY_DSN) {
      // window.Sentry?.captureException(error, { extra: errorInfo });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    // Optionally reload the page or navigate to a safe route
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          reset: this.handleReset
        });
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] px-4">
          <div className="max-w-md w-full bg-[#2a2a2a] rounded-xl p-8 text-center">
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              Oops! Something went wrong
            </h2>

            <p className="text-gray-400 mb-6">
              {this.props.errorMessage ||
                "We're sorry, but something unexpected happened. Please try again."}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-[#1a1a1a] p-4 rounded-lg">
                <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="text-xs text-red-400 font-mono overflow-auto max-h-40">
                  <p className="mb-2">{this.state.error.toString()}</p>
                  <pre className="whitespace-pre-wrap">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white rounded-lg font-medium transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
