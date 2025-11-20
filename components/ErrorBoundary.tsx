import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service (e.g., Sentry)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-error-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-error-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    Something went wrong
                  </h2>
                  <p className="text-sm text-neutral-600 mt-1">
                    We encountered an unexpected error
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-neutral-700">
                  The application encountered an error and couldn't continue. This issue has been logged
                  and we'll look into it.
                </p>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-neutral-900 hover:text-neutral-700">
                      Error Details (Development Only)
                    </summary>
                    <div className="mt-2 p-4 bg-neutral-100 rounded-md overflow-auto">
                      <pre className="text-xs text-error-600 whitespace-pre-wrap">
                        {this.state.error.toString()}
                        {this.state.error.stack && `\n\n${this.state.error.stack}`}
                      </pre>
                    </div>
                  </details>
                )}
              </div>
            </CardContent>

            <CardFooter>
              <Button
                variant="ghost"
                leftIcon={<Home className="h-4 w-4" />}
                onClick={this.handleGoHome}
              >
                Go to Home
              </Button>
              <Button
                variant="primary"
                leftIcon={<RefreshCw className="h-4 w-4" />}
                onClick={this.handleReset}
              >
                Try Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
