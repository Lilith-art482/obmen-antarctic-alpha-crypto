'use client';
import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="glass p-6 rounded-xl text-center">
          <p className="text-red-400 mb-2">Что-то пошло не так</p>
          <button onClick={() => this.setState({ hasError: false, error: null })} className="text-indigo-400 hover:text-indigo-300">
            Попробовать снова
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}