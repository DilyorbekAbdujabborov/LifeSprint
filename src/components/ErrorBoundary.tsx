import React from 'react';
import { AlertCircle } from 'lucide-react';

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Xatolik yuz berdi</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md">
            {this.state.error?.message || 'Kutilmagan xatolik.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            type="button"
          >
            Qayta urinish
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
