import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call the optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <AlertTriangle className="h-8 w-8" />
              </div>
            </div>

            <h2 className="mb-3 text-xl font-semibold text-slate-900">
              Something went wrong
            </h2>

            <p className="mb-6 text-sm text-slate-600 leading-relaxed">
              We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
            </p>

            {/* Error details in development */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-slate-700 mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="rounded-lg bg-slate-50 p-4 text-xs font-mono text-slate-600 overflow-auto max-h-32">
                  <div className="font-semibold mb-1">Error:</div>
                  <div className="mb-2">{this.state.error.message}</div>
                  <div className="font-semibold mb-1">Stack:</div>
                  <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                </div>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                onClick={this.handleRetry}
                className="rounded-xl px-6 py-2 text-sm font-medium"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>

              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="rounded-xl px-6 py-2 text-sm"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
