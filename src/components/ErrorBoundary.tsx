import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-6 bg-red-50 text-red-800 rounded-lg border border-red-200 m-4">
          <h2 className="text-lg font-bold mb-2">Oops, something went wrong!</h2>
          <p className="text-sm font-mono bg-white p-2 rounded border border-red-100 overflow-auto whitespace-pre-wrap">
            {this.state.error?.toString()}
          </p>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-colors"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Recover & Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
