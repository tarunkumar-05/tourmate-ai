'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-3xl shadow-sm border border-red-100 p-8 text-center">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-8">
        We encountered an issue while loading your data. This is usually a temporary database connection issue.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center gap-2 shadow-sm"
      >
        <RefreshCcw className="w-5 h-5" /> Try Again
      </button>
    </div>
  );
}
