import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallbackRender?: (props: any) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
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
      if (this.props.fallbackRender && this.state.error) {
        return this.props.fallbackRender({
          error: this.state.error,
          resetErrorBoundary: () => this.setState({ hasError: false, error: null }),
        });
      }
      return (
        <div className="w-full h-full p-4 flex flex-col items-center justify-center text-white bg-mainDark">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Something went wrong.</h1>
          <p className="mb-4">{this.state.error?.message}</p>
          <button 
            className="px-4 py-2 bg-blue-500 rounded text-white" 
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
