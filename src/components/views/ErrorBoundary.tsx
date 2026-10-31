import { Component, type ErrorInfo, type ReactNode } from "react";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: (error: Error, reset: () => void) => ReactNode;
  componentName?: string;
  onError?: (error: Error, info: ErrorInfo) => void;
}

const toError = (error: unknown) => (error instanceof Error ? error : new Error(String(error)));

export class ErrorBoundary extends Component<ErrorBoundaryProps, { error: Error | null }> {
  override state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: unknown) {
    return { error: toError(error) };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(toError(error), info);
    } else {
      console.error(`Error in ${this.props.componentName || "component"}:`, error, info);
    }
  }

  private reset = () => this.setState({ error: null });

  override render() {
    return this.state.error
      ? this.props.fallback(this.state.error, this.reset)
      : this.props.children;
  }
}
