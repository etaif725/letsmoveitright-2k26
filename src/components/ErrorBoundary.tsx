import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <h1 className="mb-4 font-heading text-3xl text-heading">Something went wrong</h1>
            <p className="mb-6 text-body">
              We apologize for the inconvenience. Please try refreshing the page.
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = "/";
              }}
              className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-heading shadow-sm transition-all hover:bg-primary-dark hover:shadow-md active:scale-[0.98]"
            >
              Go to Home Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
