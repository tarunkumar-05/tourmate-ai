import { Compass } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm">
      <div className="flex flex-col items-center animate-pulse">
        <div className="bg-primary/10 p-4 rounded-2xl mb-4">
          <Compass className="w-12 h-12 text-primary animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <h2 className="text-xl font-heading font-bold text-gray-900 tracking-tight">TourMate<span className="text-primary">.ai</span></h2>
        <p className="text-sm text-gray-500 mt-2 font-medium">Loading your next adventure...</p>
      </div>
    </div>
  );
}
